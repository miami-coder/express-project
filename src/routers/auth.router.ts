import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
import { UserValidator } from "../validators/user.validator.js";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.isBodyValid(UserValidator.create),
    authController.register,
);

export const authRouter = router;
