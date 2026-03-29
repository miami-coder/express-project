import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

import { EAccountType } from "../enums/account-type.enum.js";
import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ICar } from "../interfaces/car.interface.js";
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
            const user = res.locals.user;

            const car = (await carRepository.getById(id)) as ICar & Document;

            if (!car) {
                return res
                    .status(StatusCodesEnum.NOT_FOUND)
                    .json({ message: "Car not found" });
            }

            const carResponse = car.toObject() as any;

            if (user.accountType === EAccountType.PREMIUM) {
                const stats = await carRepository.getCarStats(
                    car.brand,
                    car.model,
                    car.region,
                );
                carResponse.stats = stats;
            } else {
                carResponse.viewCount = null;
            }

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

    public async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const updatedCar = await carRepository.updateStatus(
                id as string,
                status,
            );

            res.status(StatusCodesEnum.OK).json(updatedCar);
        } catch (e) {
            next(e);
        }
    }
}

export const carController = new CarController();
