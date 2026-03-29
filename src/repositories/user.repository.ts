// @ts-ignore
import { FilterQuery } from "mongoose";

import { IUser, IUserQuery } from "../interfaces/user.interface.js";
import { User } from "../models/user.model.js";

class UserRepository {
    public getAll(query: IUserQuery): Promise<[IUser[], number]> {
        const skip = query.pageSize * (query.page - 1);
        const filterObject: FilterQuery<IUser> = { isDeleted: false };

        if (query.search) {
            filterObject.$or = [
                { name: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
                { surname: { $regex: query.search, $options: "i" } },
            ];
        }

        return Promise.all([
            User.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort(query.order),
            User.countDocuments(filterObject),
        ]);
    }

    public create(user: Partial<IUser>): Promise<IUser> {
        return User.create(user);
    }

    public getById(userId: string): Promise<IUser> {
        return User.findById(userId);
    }

    public updateById(userId: string, user: Partial<IUser>): Promise<IUser> {
        return User.findByIdAndUpdate(userId, user, {
            returnDocument: "after",
        });
    }

    public deleteById(userId: string): Promise<IUser> {
        return User.findByIdAndDelete(userId);
    }

    public getByEmail(email: string): Promise<IUser> {
        return User.findOne({ email }).select("+password");
    }

    public blockUser(userId: string): Promise<IUser> {
        return User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { returnDocument: "after" },
        );
    }

    public unBlockUser(userId: string): Promise<IUser> {
        return User.findByIdAndUpdate(
            userId,
            { isActive: true },
            { returnDocument: "after" },
        );
    }
}

export const userRepository = new UserRepository();
