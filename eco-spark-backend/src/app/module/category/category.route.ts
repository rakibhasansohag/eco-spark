import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { CategoryController } from "./category.controller.js";
import { createCategoryZodSchema, updateCategoryZodSchema } from "./category.validation.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", checkAuth(Role.ADMIN), validateRequest(createCategoryZodSchema), CategoryController.create);
router.patch("/:id", checkAuth(Role.ADMIN), validateRequest(updateCategoryZodSchema), CategoryController.update);
router.delete("/:id", checkAuth(Role.ADMIN), CategoryController.remove);

export const CategoryRoutes = router;
