import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api.error.js";

export const errorHandler = (
    err: ApiError | Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const status = err instanceof ApiError ? err.status : 500;

    res.status(status).json({
        message: err.message || "Unknown error",
        status: status,
    });
};
