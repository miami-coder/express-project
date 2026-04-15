import { Router } from "express";

import { userController } from "../controllers/user.controller.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

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
    commonMiddleware.validateBody(UserValidator.create),
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
    commonMiddleware.isIdValid("id"),
    userController.getById,
);

router.patch(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValid("id"),
    authMiddleware.checkUpdateAccess,
    commonMiddleware.validateBody(UserValidator.update),
    userController.updateById,
);

router.patch(
    "/:id/block",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN, EUserRole.MANAGER]),
    commonMiddleware.isIdValid("id"),
    userController.blockUser,
);

router.patch(
    "/:id/unblock",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN, EUserRole.MANAGER]),
    commonMiddleware.isIdValid("id"),
    userController.unBlockUser,
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN]),
    commonMiddleware.isIdValid("id"),
    userController.deleteById,
);

export const userRouter = router;
