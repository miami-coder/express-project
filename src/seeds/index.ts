import { seedBrands } from "./brand.seed.js";
import { seedRoles } from "./role.seed.js";

export const runSeeds = async () => {
    try {
        console.log("--- [START SEEDING] ---");

        await seedRoles();
        console.log("Roles synchronized");

        await seedBrands();
        console.log("Brands synchronized");

        console.log("--- [SEEDING COMPLETED] ---");
    } catch (e) {
        console.error("Seeding failed:", e);
    }
};
