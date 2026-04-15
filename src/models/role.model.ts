import { model, Schema } from "mongoose";

const roleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
});

export const Role = model("Role", roleSchema);
