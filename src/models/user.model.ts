import { model, Schema } from "mongoose";

import { EAccountType } from "../enums/account-type.enum.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { IUser } from "../interfaces/user.interface.js";

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: Object.values(EUserRole),
            default: EUserRole.BUYER,
        },
        accountType: {
            type: String,
            enum: Object.values(EAccountType),
            default: EAccountType.BASE,
        },
        permissions: { type: [String], default: [] },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        avatar: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
        toObject: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    },
);

export const User = model<IUser>("User", userSchema);
