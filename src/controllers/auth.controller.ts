import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { authService } from "../services/auth.service.js";

class AuthController {
    public async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const data = await authService.signUp(req.body);

            res.status(StatusCodesEnum.CREATED).json({
                message: "User registered successfully.",
                data,
            });
        } catch (e) {
            next(e);
        }
    }
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await authService.signIn(req.body);

            res.status(StatusCodesEnum.OK).json({
                message: "User logged in successfully.",
                data,
            });
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
