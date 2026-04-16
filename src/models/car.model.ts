import { model, Schema, Types } from "mongoose";

import { ECarStatus } from "../enums/car-status.enum.js";
import { ECurrency } from "../enums/currency.enum.js";
import { ICar } from "../interfaces/car.interface.js";

const carSchema = new Schema(
    {
        brand: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        isDeleted: { type: Boolean, default: false },
        images: [{ type: String }],
        currency: {
            type: String,
            enum: Object.values(ECurrency),
            required: true,
        },

        prices: {
            uah: { type: Number },
            usd: { type: Number },
            eur: { type: Number },
        },
        exchangeRate: { type: Number },
        status: {
            type: String,
            enum: Object.values(ECarStatus),
            default: ECarStatus.PENDING,
        },
        editAttempts: { type: Number, default: 0 },
        viewCount: {
            total: { type: Number, default: 0 },
            daily: { type: Number, default: 0 },
            weekly: { type: Number, default: 0 },
            monthly: { type: Number, default: 0 },
        },
        region: { type: String, required: true },
        _sellerId: { type: Types.ObjectId, required: true, ref: "User" },
    },
    { timestamps: true, versionKey: false },
);

export const Car = model<ICar>("Car", carSchema);
