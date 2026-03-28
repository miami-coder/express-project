import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { carRepository } from "../repositories/car.repository.js";
import { carService } from "../services/car.service.js";

class CarController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.tokenPayload as ITokenPayload;
            const user = res.locals.user;

            const data = await carService.create(userId, req.body, user);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await carRepository.getAll({});
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
            const data = await carRepository.getById(id);

            if (!data) {
                return res
                    .status(StatusCodesEnum.NOT_FOUND)
                    .json({ message: "Car not found" });
            }

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
            const { id } = req.params;
            const updateData = req.body;

            const data = await carRepository.updateById(id, updateData);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export const carController = new CarController();
