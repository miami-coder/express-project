import { model, Schema } from "mongoose";

import { IToken } from "../interfaces/token.interface.js";

const tokenSchema = new Schema(
    {
        _userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const Token = model<IToken>("Token", tokenSchema);
