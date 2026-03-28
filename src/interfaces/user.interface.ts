import { EAccountType } from "../enums/account-type.enum.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { IBase } from "./base.interface.js";

interface IUser extends IBase {
    _id: string;
    name?: string;
    email: string;
    password?: string;
    role: EUserRole;
    accountType: EAccountType;
    permissions: string[];
    isVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    avatar?: string;
}

type IUserCreateDTO = Pick<IUser, "name" | "email" | "password"> & {
    surname: string;
    age?: number;
    role?: EUserRole;
    accountType?: EAccountType;
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
