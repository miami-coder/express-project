import { Router } from "express";

import { carController } from "../controllers/car.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { carMiddleware } from "../middlewares/car.middleware.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
import { fileMiddleware } from "../middlewares/file.middleware.js";
import { CarValidator } from "../validators/car.validator.js";
import { QueryValidator } from "../validators/query.validator.js";

const router = Router();

router.get(
    "/",
    commonMiddleware.validate(QueryValidator.pagination, "query"),
    carController.getAll,
);

router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.checkActiveStatus,
    fileMiddleware.upload.array("images", 10),
    fileMiddleware.isFilesExist,
    commonMiddleware.validate(CarValidator.create, "body"),
    carController.create,
);

router.get(
    "/:id",
    commonMiddleware.isIdValid("id"),
    carMiddleware.addView,
    carController.getById,
);

router.patch(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.checkActiveStatus,
    commonMiddleware.isIdValid("id"),
    carMiddleware.isOwnerOrStaff,
    commonMiddleware.validate(CarValidator.update, "body"),
    carController.updateById,
);

router.patch(
    "/:id/status",
    authMiddleware.checkAccessToken,
    authMiddleware.checkRole(["admin", "manager"]),
    carController.updateStatus,
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.checkActiveStatus,
    commonMiddleware.isIdValid("id"),
    carMiddleware.isOwnerOrStaff,
    carController.deleteById,
);

export const carRouter = router;
