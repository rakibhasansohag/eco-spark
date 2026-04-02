import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import { IdeaAccessController } from "./ideaAccess.controller.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.get("/my-accesses", checkAuth(Role.MEMBER), IdeaAccessController.getMyAccesses);
router.get("/:ideaId/check", checkAuth(Role.MEMBER), IdeaAccessController.checkAccess);

export const IdeaAccessRoutes = router;
