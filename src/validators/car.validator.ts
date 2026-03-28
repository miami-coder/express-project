import joi from "joi";

import { ECurrency } from "../enums/currency.enum.js";

export class CarValidator {
    private static brand = joi.string().min(2).max(30).trim();
    private static model = joi.string().min(1).max(30).trim();
    private static year = joi.number().min(1900).max(new Date().getFullYear());
    private static price = joi.number().min(0);
    private static currency = joi.string().valid(...Object.values(ECurrency));
    private static description = joi.string().min(10).max(5000);
    private static region = joi.string().min(2).max(50);

    public static create = joi.object({
        brand: this.brand.required(),
        model: this.model.required(),
        year: this.year.required(),
        price: this.price.required(),
        currency: this.currency.required(),
        description: this.description.required(),
        region: this.region.required(),
    });

    public static update = joi.object({
        brand: this.brand,
        model: this.model,
        year: this.year,
        price: this.price,
        currency: this.currency,
        description: this.description,
        region: this.region,
    });
}
