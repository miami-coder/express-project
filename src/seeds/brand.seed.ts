import mongoose from "mongoose";

import { Brand } from "../models/brand.model.js";

const brands = [
    { name: "BMW", models: ["X5", "X6", "M3", "M5"] },
    { name: "AUDI", models: ["A4", "A6", "Q7", "Q8"] },
    { name: "TOYOTA", models: ["Camry", "Corolla", "RAV4"] },
];

const seedBrands = async () => {
    try {
        await mongoose.connect(
            "mongodb://admin:admin@localhost:27017/autoria-db?authSource=admin",
        );
        await Brand.deleteMany({});
        await Brand.insertMany(brands);
        console.log("Brands successfully added!");
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedBrands();
