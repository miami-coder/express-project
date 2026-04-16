import { model, Schema } from "mongoose";

const brandSchema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        models: {
            type: [String],
            default: [],
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Brand = model("Brand", brandSchema);
