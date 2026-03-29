import { Router } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Brand } from "../models/brand.model.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (e) {
        next(e);
    }
});

router.post(
    "/request",
    authMiddleware.checkAccessToken,
    async (req, res, next) => {
        try {
            const { brandName } = req.body;

            // Simulating sending a request!

            res.status(StatusCodesEnum.CREATED).json({
                message: `Request to add brand "${brandName}" has been sent to the administrator. Thank you!`,
            });
        } catch (e) {
            next(e);
        }
    },
);

export const brandRouter = router;
