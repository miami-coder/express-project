// @ts-ignore
import { AnyKeys, FilterQuery, UpdateQuery } from "mongoose";

import {
    IUser,
    IUserCreateDTO,
    IUserQuery,
} from "../interfaces/user.interface.js";
import { User } from "../models/user.model.js";

class UserRepository {
    public async getAll(query: IUserQuery): Promise<[IUser[], number]> {
        const skip = query.pageSize * (query.page - 1);
        const filterObject: FilterQuery<IUser> = { isDeleted: false };

        if (query.search) {
            filterObject.$or = [
                { name: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
                { surname: { $regex: query.search, $options: "i" } },
            ];
        }

        return await Promise.all([
            User.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort(query.order)
                .populate("role"),
            User.countDocuments(filterObject),
        ]);
    }

    public create(user: IUserCreateDTO): Promise<IUser> {
        return User.create(user as AnyKeys<IUser>);
    }

    public getById(userId: string): Promise<IUser | null> {
        return User.findOne({ _id: userId, isDeleted: false }).populate("role");
    }

    public updateById(
        userId: string,
        user: UpdateQuery<IUser>,
    ): Promise<IUser | null> {
        return User.findOneAndUpdate({ _id: userId, isDeleted: false }, user, {
            returnDocument: "after",
        }).populate("role");
    }

    public deleteById(userId: string): Promise<IUser | null> {
        return User.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { isDeleted: true },
            { returnDocument: "after" },
        );
    }

    public getByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email, isDeleted: false })
            .select("+password")
            .populate("role");
    }

    public blockUser(userId: string): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { returnDocument: "after" },
        ).populate("role");
    }

    public unBlockUser(userId: string): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            userId,
            { isActive: true },
            { returnDocument: "after" },
        ).populate("role");
    }
}

export const userRepository = new UserRepository();
