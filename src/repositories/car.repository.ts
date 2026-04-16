// @ts-expect-error
import { FilterQuery, HydratedDocument } from "mongoose";

import { ECarStatus } from "../enums/car-status.enum.js";
import { ICar, ICarQuery } from "../interfaces/car.interface.js";
import { Car } from "../models/car.model.js";

class CarRepository {
    public async create(data: Partial<ICar>): Promise<ICar> {
        return await Car.create(data);
    }

    public async getAll(query: ICarQuery): Promise<[ICar[], number]> {
        const {
            page = 1,
            limit = 10,
            brand,
            region,
            status,
            search,
            price_min,
            price_max,
        } = query;
        const skip = (Number(page) - 1) * Number(limit);

        const filter: FilterQuery<ICar> = { isDeleted: false };

        if (brand) filter.brand = brand;
        if (region) filter.region = region;
        if (status) filter.status = status;

        if (search) {
            filter.$or = [
                { model: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (price_min || price_max) {
            filter["prices.usd"] = {};
            if (price_min) filter["prices.usd"].$gte = Number(price_min);
            if (price_max) filter["prices.usd"].$lte = Number(price_max);
        }

        const [cars, total] = await Promise.all([
            Car.find(filter as FilterQuery<ICar>)
                .populate("_sellerId", "name email")
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 })
                .exec(),
            Car.countDocuments(filter as FilterQuery<ICar>).exec(),
        ]);

        return [cars, total];
    }

    public async getById(id: string): Promise<HydratedDocument<ICar> | null> {
        return await Car.findByIdAndUpdate(
            id,
            {
                $inc: {
                    "viewCount.total": 1,
                    "viewCount.daily": 1,
                    "viewCount.weekly": 1,
                    "viewCount.monthly": 1,
                },
            },
            { returnDocument: "after" },
        ).populate("_sellerId", "name email");
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
        await Car.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
        );
    }

    public async getCarStats(
        brand: string,
        model: string,
        region: string,
    ): Promise<{ avgPriceUkraine: number; avgPriceRegion: number }> {
        const stats = await Car.aggregate([
            {
                $match: {
                    brand,
                    model,
                    status: ECarStatus.ACTIVE,
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
        return await Car.countDocuments({ _sellerId: userId });
    }
}

export const carRepository = new CarRepository();
