import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
import { AuthValidator } from "../validators/auth.validator.js";
import { UserValidator } from "../validators/user.validator.js";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(UserValidator.create),
    authController.register,
);

router.post(
    "/sign-in",
    commonMiddleware.validateBody(AuthValidator.login),
    authController.login,
);

router.post(
    "/refresh",
    commonMiddleware.validateBody(AuthValidator.refreshToken),
    authMiddleware.checkRefreshToken,
    authController.refresh,
);

router.get("/me", authMiddleware.checkAccessToken, authController.me);

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);

export const authRouter = router;
