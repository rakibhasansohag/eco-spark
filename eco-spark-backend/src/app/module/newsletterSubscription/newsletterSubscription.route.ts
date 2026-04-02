import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { NewsletterSubscriptionController } from "./newsletterSubscription.controller.js";
import { createNewsletterSubscriptionZodSchema } from "./newsletterSubscription.validation.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.post("/", validateRequest(createNewsletterSubscriptionZodSchema), NewsletterSubscriptionController.create);
router.get("/", checkAuth(Role.ADMIN), NewsletterSubscriptionController.getAll);
router.delete("/:id", checkAuth(Role.ADMIN), NewsletterSubscriptionController.remove);

export const NewsletterSubscriptionRoutes = router;
