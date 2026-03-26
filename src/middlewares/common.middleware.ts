import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { StatusCodesEnum } from "../enums/sc.enum.js";

class CommonMiddleware {
    public isBodyValid(validator: ObjectSchema) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error, value } = validator.validate(req.body);

                if (error) {
                    res.status(StatusCodesEnum.BAD_REQUEST).json({
                        message: error.details[0].message,
                    });
                    return;
                }
                req.body = value;
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();
