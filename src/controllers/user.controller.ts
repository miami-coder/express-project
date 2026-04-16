import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ApiError } from "../errors/api.error.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { IUserQuery } from "../interfaces/user.interface.js";
import { userService } from "../services/user.service.js";

class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as unknown as IUserQuery;

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
            const payload = res.locals.tokenPayload as ITokenPayload;

            const data = await userService.updateById(
                targetUserId,
                req.body,
                payload,
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
            const manager = await userService.createManager(req.body);
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
