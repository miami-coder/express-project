import { Types } from "mongoose";

import { EAccountType } from "../enums/account-type.enum.js";
import { IBase } from "./base.interface.js";
import { IRole } from "./role.interface.js";

interface IUser extends IBase {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: IRole | Types.ObjectId | string;
    accountType: EAccountType;
    permissions: string[];
    isVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    avatar?: string;
    age: number;
}

interface IUserCreateDTO {
    name: string;
    surname: string;
    email: string;
    password: string;
    age?: number;
    role: string | Types.ObjectId;
    accountType?: EAccountType;
    isDeleted?: boolean;
    isActive?: boolean;
}

type IUserUpdateDTO = Partial<
    Pick<IUser, "name" | "surname" | "age" | "avatar">
>;

type IUserQuery = {
    pageSize: number;
    page: number;
    search?: string;
    order?: string;
};

export { IUser, IUserCreateDTO, IUserQuery, IUserUpdateDTO };
