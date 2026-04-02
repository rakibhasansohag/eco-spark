import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import { paymentSearchableFields, paymentFilterableFields } from "./payment.constant.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { IInitiatePayment } from "./payment.interface.js";
import { IdeaStatus, PaymentStatus } from "../../../generated/prisma/index.js";
import { stripe } from "../../config/stripe.config.js";
import { envVars } from "../../config/env.js";
import Stripe from "stripe";

export const PaymentService = {
  initiate: async (userId: string, payload: IInitiatePayment) => {
    const idea = await prisma.idea.findUnique({ where: { id: payload.ideaId } });
    if (!idea || idea.status !== IdeaStatus.APPROVED) {
      throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
    }
    if (!idea.isPaid || !idea.price) {
      throw new AppError(StatusCodes.BAD_REQUEST, "This idea does not require payment");
    }
    if (idea.authorId === userId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Authors cannot purchase their own ideas");
    }

    const existingAccess = await prisma.ideaAccess.findUnique({
      where: { userId_ideaId: { userId, ideaId: idea.id } },
    });
    if (existingAccess) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Idea already unlocked");
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        ideaId: idea.id,
        amount: idea.price,
        status: PaymentStatus.PENDING,
        provider: "stripe",
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: undefined,
      success_url: `${envVars.FRONTEND_URL}/member/dashboard/my-payments?transactionId=${payment.id}`,
      cancel_url: `${envVars.FRONTEND_URL}/ideas/${idea.id}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(idea.price) * 100),
            product_data: {
              name: idea.title,
              description: "Paid idea access",
            },
          },
        },
      ],
      metadata: {
        paymentId: payment.id,
        userId,
        ideaId: idea.id,
      },
    });

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { transactionId: session.id },
    });

    return {
      payment: updated,
      checkoutUrl: session.url,
    };
  },

  handleWebhook: async (event: Stripe.Event) => {
    if (event.type !== "checkout.session.completed") {
      return { handled: false };
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.["paymentId"];
    if (!paymentId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Missing payment metadata");
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.SUCCESS, transactionId: session.id },
      });

      await tx.ideaAccess.upsert({
        where: { userId_ideaId: { userId: payment.userId, ideaId: payment.ideaId } },
        update: { paymentId: payment.id },
        create: { userId: payment.userId, ideaId: payment.ideaId, paymentId: payment.id },
      });
    });

    return { handled: true };
  },

  getMyPayments: async (userId: string, query: IQueryParams) => {
    const qb = new QueryBuilder(
      prisma.payment,
      { ...query, userId },
      { searchableFields: paymentSearchableFields, filterableFields: paymentFilterableFields }
    );
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },

  verify: async (transactionId: string, userId: string) => {
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: { idea: true },
    });
    if (!payment || payment.userId !== userId) {
      throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
    }
    return payment;
  },
};
