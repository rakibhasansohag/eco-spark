import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import { NotificationController } from "./notification.controller.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.get("/", checkAuth(Role.MEMBER, Role.ADMIN), NotificationController.getAll);
router.patch("/:id/read", checkAuth(Role.MEMBER, Role.ADMIN), NotificationController.markAsRead);

export const NotificationRoutes = router;
