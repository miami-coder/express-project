import { model, Schema } from "mongoose";

const brandSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        models: [{ type: String }],
    },
    { timestamps: true, versionKey: false },
);

export const Brand = model("Brand", brandSchema);
