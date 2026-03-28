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

    public async deleteById(id: string): Promise<void> {
        await Car.findByIdAndDelete(id);
    }

    public async getCarStats(brand: string, model: string, region: string) {
        const stats = await Car.aggregate([
            {
                $match: {
                    brand,
                    model,
                    status: "active",
                },
            },
            {
                $group: {
                    _id: null,
                    avgPriceUkraine: { $avg: "$price" },
                    avgPriceRegion: {
                        $avg: {
                            $cond: [
                                { $eq: ["$region", region] },
                                "$price",
                                null,
                            ],
                        },
                    },
                },
            },
        ]);

        return stats.length > 0
            ? {
                  avgPriceUkraine: Math.round(stats[0].avgPriceUkraine),
                  avgPriceRegion: Math.round(stats[0].avgPriceRegion || 0),
              }
            : { avgPriceUkraine: 0, avgPriceRegion: 0 };
    }

    public async countByUserId(userId: string): Promise<number> {
        return await Car.countDocuments({ _sellerId: userId });
    }
}

export const carRepository = new CarRepository();
