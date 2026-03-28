// @ts-ignore
import { FilterQuery } from "mongoose";

import { ICar } from "../interfaces/car.interface.js";
import { Car } from "../models/car.model.js";

class CarRepository {
    public async create(data: Partial<ICar>): Promise<ICar> {
        return await Car.create(data);
    }

    public async getAll(filter: FilterQuery<ICar>): Promise<ICar[]> {
        return await Car.find(filter).populate("_sellerId", "name email");
    }

    public async getById(id: string): Promise<ICar | null> {
        return await Car.findById(id).populate("_sellerId", "name email");
    }

    public async updateById(
        id: string,
        data: Partial<ICar>,
    ): Promise<ICar | null> {
        return await Car.findByIdAndUpdate(id, data, {
            returnDocument: "after",
        });
    }

    public async updateStatus(
        id: string,
        status: string,
    ): Promise<ICar | null> {
        return await Car.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: "after" },
        );
    }

    public async getAveragePrice(filter: FilterQuery<ICar>): Promise<number> {
        const result = await Car.aggregate([
            { $match: filter },
            { $group: { _id: null, avgPrice: { $avg: "$price" } } },
        ]);
        return result.length > 0 ? result[0].avgPrice : 0;
    }

    public async countByUserId(userId: string): Promise<number> {
        return await Car.countDocuments({ _sellerId: userId });
    }
}

export const carRepository = new CarRepository();
