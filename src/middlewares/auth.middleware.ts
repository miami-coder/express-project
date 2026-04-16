import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ApiError } from "../errors/api.error.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { tokenService } from "../services/token.service.js";
import { userService } from "../services/user.service.js";

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
            const tokenFromDb = await tokenRepository.findOne({ accessToken });
            if (!tokenFromDb)
                throw new ApiError(
                    "Token not found",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            const user = await userService.getById(payload.userId);
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

    public async checkRefreshToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const refreshToken = req.get("Authorization")?.split("Bearer ")[1];
            if (!refreshToken) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            const payload = tokenService.checkToken(refreshToken, "refresh");

            const tokenFromDb = await tokenRepository.findOne({ refreshToken });
            if (!tokenFromDb) {
                throw new ApiError(
                    "Token not found",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            res.locals.tokenPayload = payload;
            next();
        } catch (e) {
            next(e);
        }
    }

    public checkRole(roles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const { role } = res.locals.tokenPayload as ITokenPayload;
                if (!roles.includes(role)) {
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

    public async checkActiveStatus(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = res.locals.tokenPayload as ITokenPayload;
            const user = await userService.getById(userId);

            if (!user) {
                throw new ApiError(
                    "User not found",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            if (!user.isActive) {
                throw new ApiError(
                    "Your account is blocked. Contact support.",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    public checkUpdateAccess(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, role } = res.locals.tokenPayload as ITokenPayload;
            const { id } = req.params;

            if (role === "admin" || role === "manager") {
                return next();
            }

            if (userId !== id) {
                throw new ApiError(
                    "You can only update your own profile",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const authMiddleware = new AuthMiddleware();
