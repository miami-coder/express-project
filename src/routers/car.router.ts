import { Router } from "express";

import { carController } from "../controllers/car.controller.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { carMiddleware } from "../middlewares/car.middleware.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
import { CarValidator } from "../validators/car.validator.js";

const router = Router();

router.get("/", carController.getAll);

router.post(
    "/",
    authMiddleware.checkAccessToken,
    commonMiddleware.validateBody(CarValidator.create),
    carController.create,
);

router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    carMiddleware.addView,
    carController.getById,
);

router.patch(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.validateBody(CarValidator.update),
    carController.updateById,
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.MANAGER, EUserRole.ADMIN]),
    carController.deleteById,
);

export const carRouter = router;
