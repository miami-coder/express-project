import { Brand } from "../models/brand.model.js";

const brands = [
    { name: "BMW", models: ["X5", "X6", "M3", "M5"] },
    { name: "AUDI", models: ["A4", "A6", "Q7", "Q8"] },
    { name: "TOYOTA", models: ["Camry", "Corolla", "RAV4"] },
];

export const seedBrands = async () => {
    try {
        await Brand.deleteMany({});
        await Brand.insertMany(brands);
        console.log("Brands successfully added!");
    } catch (e) {
        console.error(e);
    }
};
