import { model, Schema } from "mongoose";

import { IRole } from "../interfaces/role.interface.js";

const roleSchema = new Schema<IRole>(
    {
        name: { type: String, required: true, unique: true },
        permissions: [{ type: String }],
    },
    { timestamps: true, versionKey: false },
);

export const Role = model("Role", roleSchema);
