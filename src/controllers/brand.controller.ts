import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { brandService } from "../services/brand.service.js";

class BrandController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const brands = await brandService.getAll();
            res.status(StatusCodesEnum.OK).json(brands);
        } catch (e) {
            next(e);
        }
    }

    public async requestBrand(req: Request, res: Response, next: NextFunction) {
        try {
            const { brandName } = req.body;
            const { name: userName } = res.locals.tokenPayload;

            await brandService.requestBrand(brandName, userName);

            res.status(StatusCodesEnum.CREATED).json({
                message: `Request to add brand "${brandName}" has been sent to the administrator. Thank you!`,
            });
        } catch (e) {
            next(e);
        }
    }
}

export const brandController = new BrandController();
