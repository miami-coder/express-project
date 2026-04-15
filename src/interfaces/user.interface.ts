import mongoose from "mongoose";

import { EAccountType } from "../enums/account-type.enum.js";
import { IBase } from "./base.interface.js";
import { IRole } from "./role.interface";

interface IUser extends IBase {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: IRole;
    accountType: EAccountType;
    permissions: string[];
    isVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    avatar?: string;
    age?: number;
}

type IUserCreateDTO = Pick<
    IUser,
    "name" | "surname" | "email" | "password" | "isDeleted"
> & {
    age: number;
    role: mongoose.Types.ObjectId;
    accountType: EAccountType;
    isActive?: boolean;
};

type IUserUpdateDTO = Pick<IUser, "name" | "avatar">;

type IUserQuery = {
    pageSize: number;
    page: number;
    search?: string;
    order?: string;
};

export { IUser, IUserCreateDTO, IUserQuery, IUserUpdateDTO };
