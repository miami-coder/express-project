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
    authMiddleware.checkActiveStatus,
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
    authMiddleware.checkActiveStatus,
    commonMiddleware.validateBody(CarValidator.update),
    carController.updateById,
);

router.patch(
    "/:id/status",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole([EUserRole.ADMIN, EUserRole.MANAGER]),
    carController.updateStatus,
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.checkActiveStatus,
    authMiddleware.checkRole([EUserRole.MANAGER, EUserRole.ADMIN]),
    carController.deleteById,
);

export const carRouter = router;
