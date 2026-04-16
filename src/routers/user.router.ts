import { Router } from "express";

import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
import { QueryValidator } from "../validators/query.validator.js";
import { UserValidator } from "../validators/user.validator.js";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole(["admin", "manager"]),
    commonMiddleware.validate(QueryValidator.pagination, "query"),
    userController.getAll,
);

router.post(
    "/manager",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole(["admin"]),
    commonMiddleware.validate(UserValidator.create, "body"),
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
    authMiddleware.checkRole(["admin", "manager"]),
    commonMiddleware.isIdValid("id"),
    userController.getById,
);

router.patch(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValid("id"),
    authMiddleware.checkUpdateAccess,
    commonMiddleware.validate(UserValidator.update, "body"),
    userController.updateById,
);

router.patch(
    "/:id/block",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole(["admin", "manager"]),
    commonMiddleware.isIdValid("id"),
    userController.blockUser,
);

router.patch(
    "/:id/unblock",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole(["admin", "manager"]),
    commonMiddleware.isIdValid("id"),
    userController.unBlockUser,
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole(["admin"]),
    commonMiddleware.isIdValid("id"),
    userController.deleteById,
);

export const userRouter = router;
