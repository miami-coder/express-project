import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ApiError } from "../errors/api.error.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { Car } from "../models/car.model.js";

class CarMiddleware {
    public async addView(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await Car.findByIdAndUpdate(id, {
                $inc: {
                    "viewCount.total": 1,
                    "viewCount.daily": 1,
                    "viewCount.weekly": 1,
                    "viewCount.monthly": 1,
                },
            });

            next();
        } catch (e) {
            next(e);
        }
    }

    public async isOwnerOrStaff(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const { userId, role } = res.locals.tokenPayload as ITokenPayload;

            const car = await Car.findById(id);

            if (!car) {
                throw new ApiError("Car not found", StatusCodesEnum.NOT_FOUND);
            }

            const isStaff = role === "admin" || role === "manager";
            const isOwner = car._sellerId.toString() === userId;

            if (!isStaff && !isOwner) {
                throw new ApiError(
                    "Access denied: You are not the owner of this ad",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            res.locals.car = car;
            next();
        } catch (e) {
            next(e);
        }
    }
}

export const carMiddleware = new CarMiddleware();
