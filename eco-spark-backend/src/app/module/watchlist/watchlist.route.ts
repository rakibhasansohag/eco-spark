import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { WatchlistController } from "./watchlist.controller.js";
import { createWatchlistZodSchema } from "./watchlist.validation.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();
router.get("/", checkAuth(Role.MEMBER, Role.ADMIN), WatchlistController.getAll);
router.post("/", checkAuth(Role.MEMBER), validateRequest(createWatchlistZodSchema), WatchlistController.create);
router.delete("/:id", checkAuth(Role.MEMBER), WatchlistController.remove);

export const WatchlistRoutes = router;
