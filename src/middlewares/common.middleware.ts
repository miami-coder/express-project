import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api.error.js";

class CommonMiddleware {
    public isIdValid(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.params[key];

                if (!isObjectIdOrHexString(id)) {
                    throw new ApiError(`${key}: ${id} invalid Id`, 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }

    public validate(
        validator: ObjectSchema,
        field: "body" | "query" | "params" = "body",
    ) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const value = await validator.validateAsync(req[field], {
                    stripUnknown: true,
                    abortEarly: false,
                });

                req[field] = value;
                next();
            } catch (e: any) {
                const message = e.details.map((d: any) => d.message).join(", ");
                next(new ApiError(message, 400));
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();
