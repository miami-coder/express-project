import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
// Якщо AuthValidator ще не створений — створи його або закоментуй валідацію refresh
// import { AuthValidator } from "../validators/auth.validator.js";
import { UserValidator } from "../validators/user.validator.js";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(UserValidator.create),
    authController.register,
);

router.post("/sign-in", authController.login);

// router.post(
//     "/refresh",
//     // commonMiddleware.validateBody(AuthValidator.refreshToken), // Розкоментуй, коли додаси AuthValidator
//     authMiddleware.checkRefreshToken,
//     authController.refresh,
// );
//
// router.get("/me", authMiddleware.checkAccessToken, authController.me);

export const authRouter = router;
