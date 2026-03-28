import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { StatusCodesEnum } from "../enums/sc.enum.js";
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
    public validateBody(validator: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = await validator.validateAsync(req.body, {
                    stripUnknown: false,
                    abortEarly: false,
                });
                next();
            } catch (e) {
                next(new ApiError(e.details[0].message, 400));
            }
        };
    }

    public isFileExists() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.file) {
                    throw new ApiError(
                        "No file upload",
                        StatusCodesEnum.BAD_REQUEST,
                    );
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }

    public query(validator: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const query = await validator.validateAsync(req.query);
                (req as any).validatedQuery = query;
                next();
            } catch (e) {
                next(new ApiError(e.message, StatusCodesEnum.BAD_REQUEST));
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();
