import { NextFunction, Request, Response } from "express";

import { EAccountType } from "../enums/account-type.enum.js";
import { StatusCodesEnum } from "../enums/sc.enum.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { ApiError } from "../errors/api.error.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { IUser, IUserUpdateDTO } from "../interfaces/user.interface.js";
import { userService } from "../services/user.service.js";

class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = (req as any).validatedQuery || {
                page: Number(req.query.page) || 1,
                pageSize: Number(req.query.pageSize) || 10,
                search: (req.query.search as string) || "",
                order: (req.query.order as string) || "createdAt",
            };

            const data = await userService.getAll(query);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getById(
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const data = await userService.getById(id);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id: targetUserId } = req.params;
            const { userId: myId, role: myRole } = res.locals
                .tokenPayload as ITokenPayload;

            const body = req.body as IUserUpdateDTO & { role?: string };

            if (myRole !== EUserRole.ADMIN && targetUserId !== myId) {
                throw new ApiError(
                    "You can only update your own profile",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            const { role, ...rest } = body;

            const finalUpdateData =
                myRole === EUserRole.ADMIN ? { ...rest, role } : rest;

            const data = await userService.updateById(
                targetUserId,
                finalUpdateData as Partial<IUser>,
            );

            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await userService.deleteById(id as string);
            res.status(StatusCodesEnum.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    }

    public async blockUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.params;
            const { userId: myId } = res.locals.tokenPayload as ITokenPayload;
            if (userId === myId) {
                throw new ApiError("Not permitted", StatusCodesEnum.FORBIDDEN);
            }

            const data = await userService.blockUser(userId as string);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async unBlockUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.params;
            const { userId: myId } = res.locals.tokenPayload as ITokenPayload;
            if (userId === myId) {
                throw new ApiError("Not permitted", StatusCodesEnum.FORBIDDEN);
            }

            const data = await userService.unblockUser(userId as string);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }
    public async createManager(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { email, password, name, surname } = req.body;

            if (!email || !password) {
                throw new ApiError(
                    "Email and password are required",
                    StatusCodesEnum.BAD_REQUEST,
                );
            }
            const manager = await userService.create({
                email,
                password,
                name: name || "Manager",
                surname: surname || "Staff",
                role: EUserRole.MANAGER,
                accountType: EAccountType.PREMIUM,
            });
            res.status(StatusCodesEnum.CREATED).json(manager);
        } catch (e) {
            next(e);
        }
    }

    public async upgradeMyAccount(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = res.locals.tokenPayload as ITokenPayload;

            const updatedUser = await userService.upgradeToPremium(userId);

            res.status(StatusCodesEnum.OK).json({
                message: "Success! You are now a Premium user.",
                user: updatedUser,
            });
        } catch (e) {
            next(e);
        }
    }
}

export const userController = new UserController();
