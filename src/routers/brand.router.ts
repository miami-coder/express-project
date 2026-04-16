import { Router } from "express";

import { brandController } from "../controllers/brand.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
import { BrandValidator } from "../validators/brand.validator.js";

const router = Router();

router.get("/", brandController.getAll);

router.post(
    "/request",
    authMiddleware.checkAccessToken,
    commonMiddleware.validate(BrandValidator.request, "body"),
    brandController.requestBrand,
);

export const brandRouter = router;
