import { Router } from "express";

import { userController } from "../controllers/user.controller.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware.checkAccessToken, userController.getAll);

router.patch(
    "/:id/block",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN, EUserRole.MANAGER]),
    userController.blockUser,
);

router.patch(
    "/:id/unblock",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN, EUserRole.MANAGER]),
    userController.unBlockUser,
);

export const userRouter = router;
