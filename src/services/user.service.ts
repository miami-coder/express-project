import { EAccountType } from "../enums/account-type.enum.js";
import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ApiError } from "../errors/api.error.js";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import {
    IUser,
    IUserCreateDTO,
    IUserQuery,
} from "../interfaces/user.interface.js";
import { Role } from "../models/role.model.js";
import { roleRepository } from "../repositories/role.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { passwordService } from "./password.service.js";

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

    public async create(user: IUserCreateDTO): Promise<IUser> {
        if (typeof user.role === "string" && user.role.length < 24) {
            const roleDoc = await Role.findOne({ name: user.role });
            if (!roleDoc) {
                throw new ApiError("Role not found", StatusCodesEnum.NOT_FOUND);
            }
            user.role = roleDoc._id;
        }
        return await userRepository.create(user);
    }

    public async getById(userId: string): Promise<IUser | null> {
        const user = await userRepository.getById(userId);
        if (!user || user.isDeleted) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return user;
    }
    public async updateById(
        targetUserId: string,
        dto: any,
        currentUser: ITokenPayload,
    ): Promise<IUser | null> {
        if (
            currentUser.role !== "admin" &&
            targetUserId !== currentUser.userId
        ) {
            throw new ApiError("You can only update your own profile", 403);
        }

        const finalUpdateData = { ...dto };

        if (currentUser.role !== "admin") {
            delete (finalUpdateData as any).role;
        }

        return await userRepository.updateById(targetUserId, finalUpdateData);
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

    public async createManager(dto: IUserCreateDTO): Promise<IUser> {
        const hashedPassword = await passwordService.hashPassword(dto.password);

        const managerRole = await roleRepository.getByName("manager");
        if (!managerRole) {
            throw new ApiError("Role 'manager' not found in DB", 500);
        }

        return await userRepository.create({
            ...dto,
            password: hashedPassword,
            role: managerRole._id,
            accountType: EAccountType.PREMIUM,
        });
    }
}

export const userService = new UserService();
