import { EAccountType } from "../enums/account-type.enum.js";
import { EUserRole } from "../enums/user-role.enum.js";
import { IBase } from "./base.interface.js";

interface IUser extends IBase {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: EUserRole;
    accountType: EAccountType;
    permissions: string[];
    isVerified: boolean;
    isActive: boolean;
    avatar?: string;
}

type IUserCreateDTO = Pick<IUser, "name" | "email" | "password">;

type IUserUpdateDTO = Pick<IUser, "name" | "avatar">;

type IUserQuery = {
    page?: string;
    limit?: string;
    search?: string;
};

export { IUser, IUserCreateDTO, IUserQuery, IUserUpdateDTO };
