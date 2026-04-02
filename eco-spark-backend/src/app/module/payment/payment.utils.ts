import Stripe from "stripe";
import { envVars } from "../../config/env.js";

export const getStripeWebhookEvent = (payload: Buffer, signature: string): Stripe.Event => {
  return new Stripe(envVars.STRIPE_SECRET_KEY).webhooks.constructEvent(
    payload,
    signature,
    envVars.STRIPE_WEBHOOK_SECRET
  );
};
