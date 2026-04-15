import { Role } from "../models/role.model.js";

export const seedRoles = async () => {
    const roles = [
        { name: "admin", permissions: ["all"] },
        {
            name: "manager",
            permissions: ["car_read", "car_update", "user_block"],
        },
        {
            name: "seller",
            permissions: [
                "car_create",
                "car_read",
                "car_update",
                "car_delete_own",
            ],
        },
        { name: "buyer", permissions: ["car_read"] },
    ];

    for (const role of roles) {
        await Role.updateOne(
            { name: role.name },
            { $set: role },
            { upsert: true },
        );
    }
};
