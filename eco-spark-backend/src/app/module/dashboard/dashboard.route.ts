import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import { DashboardController } from "./dashboard.controller.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.get("/admin-stats", checkAuth(Role.ADMIN), DashboardController.getAdminStats);
router.get("/member-stats", checkAuth(Role.MEMBER), DashboardController.getMemberStats);

export const DashboardRoutes = router;
