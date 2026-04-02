import { Router } from "express";
import validateRequest from "../../middleware/validateRequest.js";
import checkAuth from "../../middleware/checkAuth.js";
import { AuthController } from "./auth.controller.js";
import { registerZodSchema, loginZodSchema } from "./auth.validation.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.post("/register", validateRequest(registerZodSchema), AuthController.register);
router.post("/login", validateRequest(loginZodSchema), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", checkAuth(Role.ADMIN, Role.MEMBER), AuthController.logout);

export const AuthRoutes = router;
