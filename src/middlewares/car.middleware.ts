import { NextFunction, Request, Response } from "express";

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
}

export const carMiddleware = new CarMiddleware();
