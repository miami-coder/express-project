import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { carService } from "../services/car.service.js";

class CarController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as ITokenPayload;
            const user = res.locals.user;
            const files = req.files as Express.Multer.File[];

            const data = await carService.create(userId, req.body, user, files);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await carService.getAll(req.query);
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
            const user = res.locals.user;

            const carResponse = await carService.getById(id, user);

            res.status(StatusCodesEnum.OK).json(carResponse);
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
            const { id } = req.params;

            const data = await carService.update(id, req.body);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await carService.delete(id as string);
            res.sendStatus(StatusCodesEnum.NO_CONTENT);
        } catch (e) {
            next(e);
        }
    }

    public async updateStatus(
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const updatedCar = await carService.updateStatus(id, status);

            res.status(StatusCodesEnum.OK).json(updatedCar);
        } catch (e) {
            next(e);
        }
    }
}

export const carController = new CarController();
