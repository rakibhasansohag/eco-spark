import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { CommentController } from "./comment.controller.js";
import { createCommentZodSchema, updateCommentZodSchema } from "./comment.validation.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.get("/", CommentController.getAll);
router.post("/", checkAuth(Role.MEMBER), validateRequest(createCommentZodSchema), CommentController.create);
router.patch("/:id", checkAuth(Role.MEMBER), validateRequest(updateCommentZodSchema), CommentController.update);
router.delete("/:id", checkAuth(Role.MEMBER, Role.ADMIN), CommentController.remove);

export const CommentRoutes = router;
