import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { UserController } from "./user.controller.js";
import { updateProfileZodSchema, updateUserByAdminZodSchema } from "./user.validation.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

// Specific paths BEFORE parameterized paths
router.get("/my-profile", checkAuth(Role.ADMIN, Role.MEMBER), UserController.getMyProfile);
router.patch("/my-profile", checkAuth(Role.ADMIN, Role.MEMBER), validateRequest(updateProfileZodSchema), UserController.updateMyProfile);

router.get("/", checkAuth(Role.ADMIN), UserController.getAll);
router.get("/:id", checkAuth(Role.ADMIN), UserController.getById);
router.patch("/:id", checkAuth(Role.ADMIN), validateRequest(updateUserByAdminZodSchema), UserController.updateByAdmin);

export const UserRoutes = router;
