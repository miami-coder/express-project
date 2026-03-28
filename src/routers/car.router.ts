import { Router } from "express";

import { carController } from "../controllers/car.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
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

router.get("/:id", carController.getById);

router.patch(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.validateBody(CarValidator.update),
    carController.updateById,
);

export const carRouter = router;
