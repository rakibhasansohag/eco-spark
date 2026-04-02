import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route.js";
import { UserRoutes } from "../module/user/user.route.js";
import { CategoryRoutes } from "../module/category/category.route.js";
import { IdeaRoutes } from "../module/idea/idea.route.js";
import { VoteRoutes } from "../module/vote/vote.route.js";
import { CommentRoutes } from "../module/comment/comment.route.js";
import { PaymentRoutes } from "../module/payment/payment.route.js";
import { IdeaAccessRoutes } from "../module/ideaAccess/ideaAccess.route.js";
import { NewsletterSubscriptionRoutes } from "../module/newsletterSubscription/newsletterSubscription.route.js";
import { DashboardRoutes } from "../module/dashboard/dashboard.route.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/categories", CategoryRoutes);
router.use("/ideas", IdeaRoutes);
router.use("/votes", VoteRoutes);
router.use("/comments", CommentRoutes);
router.use("/payments", PaymentRoutes);
router.use("/idea-accesses", IdeaAccessRoutes);
router.use("/newsletter-subscriptions", NewsletterSubscriptionRoutes);
router.use("/dashboard", DashboardRoutes);

export default router;
