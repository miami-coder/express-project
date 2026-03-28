import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { ApiError } from "../errors/api.error.js";
import { User } from "../models/user.model.js";
import { tokenService } from "../services/token.service.js";

class AuthMiddleware {
    public async checkAccessToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const accessToken = req.get("Authorization")?.split("Bearer ")[1];
            if (!accessToken) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            const payload = tokenService.checkToken(accessToken, "access");
            const user = await User.findById(payload.userId);
            if (!user) {
                throw new ApiError(
                    "User not found",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            if (!user.isActive) {
                throw new ApiError(
                    "Your account has been blocked by a moderator. Access is denied.",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            res.locals.tokenPayload = payload;
            res.locals.user = user;
            next();
        } catch (e) {
            next(e);
        }
    }

    public checkRole(roles: EUserRole[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = res.locals.user;
                if (!roles.includes(user.role)) {
                    throw new ApiError(
                        "Forbidden: Insufficient permisions",
                        StatusCodesEnum.FORBIDDEN,
                    );
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const authMiddleware = new AuthMiddleware();
