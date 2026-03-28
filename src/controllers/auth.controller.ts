import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { IRefresh, ITokenPayload } from "../interfaces/token.interface.js";
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

    public async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = res.locals.tokenPayload as ITokenPayload & IRefresh;

            const data = await authService.refresh(
                payload,
                payload.refreshToken,
            );

            res.status(StatusCodesEnum.OK).json({
                message: "Tokens refreshed successfully.",
                data,
            });
        } catch (e) {
            next(e);
        }
    }

    public async me(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;

            if (!user) {
                return res.status(StatusCodesEnum.UNAUTHORIZED).json({
                    message: "User not found in session",
                });
            }

            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
