import { EAccountType } from "../enums/account-type.enum.js";
import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ApiError } from "../errors/api.error.js";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface.js";
import {
    IUser,
    IUserCreateDTO,
    IUserQuery,
} from "../interfaces/user.interface.js";
import { userRepository } from "../repositories/user.repository.js";

class UserService {
    public async getAll(query: IUserQuery): Promise<IPaginatedResponse<IUser>> {
        const [data, totalItems] = await userRepository.getAll(query);

        const totalPages = Math.ceil(totalItems / query.pageSize);
        return {
            totalItems,
            totalPages,
            prevPage: !!(query.page - 1),
            nextPage: query.page + 1 <= totalPages,
            data,
        };
    }

    public create(user: IUserCreateDTO): Promise<IUser> {
        return userRepository.create(user);
    }

    public async getById(userId: string): Promise<IUser | null> {
        const user = await userRepository.getById(userId);
        if (!user || user.isDeleted) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return user;
    }
    public async updateById(
        userId: string,
        user: Partial<IUser>,
    ): Promise<IUser | null> {
        await this.getById(userId);
        return await userRepository.updateById(userId, user);
    }

    public async deleteById(userId: string): Promise<void> {
        await this.getById(userId);
        await userRepository.deleteById(userId);
    }

    public async isEmailUnique(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError(
                "User is already exists",
                StatusCodesEnum.CONFLICT,
            );
        }
    }

    public async blockUser(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user || user.isDeleted) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }

        const updatedUser = await userRepository.blockUser(userId);

        if (!updatedUser) {
            throw new ApiError(
                "Failed to block user",
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        return updatedUser;
    }

    public async unblockUser(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user || user.isDeleted) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }

        const updatedUser = await userRepository.unBlockUser(userId);

        if (!updatedUser) {
            throw new ApiError(
                "Failed to unblock user",
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        return updatedUser;
    }

    public async upgradeToPremium(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);

        if (!user || user.isDeleted) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }

        const updatedUser = await userRepository.updateById(userId, {
            accountType: EAccountType.PREMIUM,
        });

        if (!updatedUser) {
            throw new ApiError(
                "Failed to update user",
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        return updatedUser;
    }
}

export const userService = new UserService();
