import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route.js";
import { UserRoutes } from "../module/user/user.route.js";
import { CategoryRoutes } from "../module/category/category.route.js";
import { IdeaRoutes } from "../module/idea/idea.route.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/categories", CategoryRoutes);
router.use("/ideas", IdeaRoutes);

export default router;
