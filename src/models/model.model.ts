import { model, Schema } from "mongoose";

import { IModel } from "../interfaces/model.interface.js";

const modelSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    },
    { timestamps: true, versionKey: false },
);

export const Model = model<IModel>("Model", modelSchema);
