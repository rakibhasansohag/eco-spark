import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { ReviewController } from "./review.controller.js";
import { createReviewZodSchema } from "./review.validation.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();
router.get("/", ReviewController.getAll); // Public can see reviews
router.post("/", checkAuth(Role.MEMBER), validateRequest(createReviewZodSchema), ReviewController.create);

export const ReviewRoutes = router;
