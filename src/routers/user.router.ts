import { Router } from "express";

import { userController } from "../controllers/user.controller.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN, EUserRole.MANAGER]),
    userController.getAll,
);

router.post(
    "/manager",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN]),
    userController.createManager,
);

router.patch(
    "/me/upgrade",
    authMiddleware.checkAccessToken,
    authMiddleware.checkActiveStatus,
    userController.upgradeMyAccount,
);

router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN, EUserRole.MANAGER]),
    userController.getById,
);

router.patch(
    "/:id",
    authMiddleware.checkAccessToken,
    userController.updateById,
);

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

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN]),
    userController.deleteById,
);

export const userRouter = router;
