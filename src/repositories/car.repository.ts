// @ts-ignore
import { FilterQuery, Types } from "mongoose";

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
        return await Car.findById(new Types.ObjectId(id)).populate(
            "_sellerId",
            "name email",
        );
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
                $facet: {
                    allUkraine: [
                        {
                            $group: {
                                _id: null,
                                avg: { $avg: "$prices.usd" },
                            },
                        },
                    ],
                    specificRegion: [
                        { $match: { region } },
                        {
                            $group: {
                                _id: null,
                                avg: { $avg: "$prices.usd" },
                            },
                        },
                    ],
                },
            },
        ]);

        const avgUkraine = stats[0].allUkraine[0]?.avg || 0;
        const avgRegion = stats[0].specificRegion[0]?.avg || 0;

        return {
            avgPriceUkraine: Math.round(avgUkraine),
            avgPriceRegion: Math.round(avgRegion),
        };
    }

    public async countByUserId(userId: string): Promise<number> {
        const filter: FilterQuery<ICar> = {
            _sellerId: new Types.ObjectId(userId),
        };
        return await Car.countDocuments(filter);
    }
}

export const carRepository = new CarRepository();
