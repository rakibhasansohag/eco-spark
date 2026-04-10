import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { IdeaController } from "./idea.controller.js";
import { createIdeaZodSchema, updateIdeaZodSchema, rejectIdeaZodSchema } from "./idea.validation.js";
import { ideaImageUpload } from "./idea.middlewares.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

// Specific string paths MUST come before parameterized paths
router.get("/my-ideas", checkAuth(Role.MEMBER), IdeaController.getMyIdeas);
router.get("/admin-all", checkAuth(Role.ADMIN), IdeaController.getAllForAdmin);
router.post("/auto-seed", checkAuth(Role.ADMIN), IdeaController.autoSeed);

// Public routes
router.get("/", IdeaController.getAll);
router.get("/:id", IdeaController.getById);

// Member mutations
router.post(
  "/",
  checkAuth(Role.MEMBER),
  ideaImageUpload,
  validateRequest(createIdeaZodSchema),
  IdeaController.create
);
router.patch(
  "/:id",
  checkAuth(Role.MEMBER),
  ideaImageUpload,
  validateRequest(updateIdeaZodSchema),
  IdeaController.update
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.MEMBER), IdeaController.remove);
router.patch("/:id/submit", checkAuth(Role.MEMBER), IdeaController.submit);

// Admin actions
router.patch("/:id/approve", checkAuth(Role.ADMIN), IdeaController.approve);
router.patch(
  "/:id/reject",
  checkAuth(Role.ADMIN),
  validateRequest(rejectIdeaZodSchema),
  IdeaController.reject
);

export const IdeaRoutes = router;
