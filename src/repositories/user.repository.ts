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
        const skip = Math.max(0, query.pageSize * (query.page - 1));
        const filterObject: FilterQuery<IUser> = { isDeleted: false };

        if (query.search) {
            const searchRegex = { $regex: query.search, $options: "i" };
            filterObject.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { surname: searchRegex },
            ];
        }

        const sortOrder = query.order || "-createdAt";

        return await Promise.all([
            User.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort(sortOrder)
                .populate("role"),
            User.countDocuments(filterObject),
        ]);
    }

    public async create(dto: IUserCreateDTO): Promise<IUser> {
        const user = await User.create(dto as AnyKeys<IUser>);

        const populatedUser = await user.populate("role");

        return populatedUser.toObject() as IUser;
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
        return User.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { isActive: false },
            { returnDocument: "after" },
        ).populate("role");
    }

    public unBlockUser(userId: string): Promise<IUser | null> {
        return User.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { isActive: true },
            { returnDocument: "after" },
        ).populate("role");
    }
}

export const userRepository = new UserRepository();
