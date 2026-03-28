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

    public async getById(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return user;
    }
    public async updateById(
        userId: string,
        user: Partial<IUser>,
    ): Promise<IUser> {
        const data = await userRepository.getById(userId);
        if (!data) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return await userRepository.updateById(userId, user);
    }

    public async deleteById(userId: string): Promise<void> {
        const data = await userRepository.deleteById(userId);
        if (!data) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        await userRepository.deleteById(userId);
    }

    public async isEmailUnique(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError(
                "User is already exists",
                StatusCodesEnum.BAD_REQUEST,
            );
        }
    }

    public async isActive(id: string): Promise<boolean> {
        const user = await this.getById(id);
        return user.isActive;
    }

    public blockUser(user_id: string): Promise<IUser> {
        return userRepository.blockUser(user_id);
    }

    public unblockUser(user_id: string): Promise<IUser> {
        return userRepository.unBlockUser(user_id);
    }

    public getByEmail(email: string): Promise<IUser> {
        return userRepository.getByEmail(email);
    }
}

export const userService = new UserService();
