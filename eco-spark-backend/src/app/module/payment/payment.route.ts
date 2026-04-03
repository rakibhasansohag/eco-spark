import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { PaymentController } from "./payment.controller.js";
import { initiatePaymentZodSchema } from "./payment.validation.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.post("/webhook", PaymentController.webhook);
router.post("/initiate", checkAuth(Role.MEMBER), validateRequest(initiatePaymentZodSchema), PaymentController.initiate);
router.get("/my-payments", checkAuth(Role.MEMBER), PaymentController.getMyPayments);
router.get("/my-idea-sales", checkAuth(Role.MEMBER), PaymentController.getMyIdeaSales);
router.get("/verify/:transactionId", checkAuth(Role.MEMBER), PaymentController.verify);

export const PaymentRoutes = router;
