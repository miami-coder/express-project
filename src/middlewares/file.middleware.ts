import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ApiError } from "../errors/api.error.js";

class FileMiddleware {
    private readonly storage = multer.memoryStorage();

    private readonly fileFilter = (
        req: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback,
    ) => {
        if (!file.mimetype.startsWith("image/")) {
            return callback(
                new ApiError(
                    "Only images are allowed",
                    StatusCodesEnum.BAD_REQUEST,
                ),
            );
        }
        callback(null, true);
    };

    public readonly upload = multer({
        storage: this.storage,
        fileFilter: this.fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    });

    public isFilesExist(req: Request, res: Response, next: NextFunction) {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            throw new ApiError(
                "No images uploaded",
                StatusCodesEnum.BAD_REQUEST,
            );
        }
        next();
    }
}

export const fileMiddleware = new FileMiddleware();
