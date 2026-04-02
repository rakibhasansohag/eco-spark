import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { VoteController } from "./vote.controller.js";
import { createVoteZodSchema } from "./vote.validation.js";
import { Role } from "../../../generated/prisma/index.js";

const router = Router();

router.get("/:ideaId", VoteController.getCounts);
router.post("/", checkAuth(Role.MEMBER), validateRequest(createVoteZodSchema), VoteController.castOrSwitch);
router.delete("/:ideaId", checkAuth(Role.MEMBER), VoteController.remove);

export const VoteRoutes = router;
