import { EAccountType } from "../enums/account-type.enum";
import { StatusCodesEnum } from "../enums/sc.enum.js";
import { ApiError } from "../errors/api.error.js";
import { IAuth } from "../interfaces/auth.interface.js";
import { IRole } from "../interfaces/role.interface";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface.js";
import { IUser, IUserCreateDTO } from "../interfaces/user.interface.js";
import { Role } from "../models/role.model";
import { tokenRepository } from "../repositories/token.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";
import { userService } from "./user.service.js";

class AuthService {
    public async signUp(
        user: IUserCreateDTO,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        await userService.isEmailUnique(user.email);

        const password = await passwordService.hashPassword(user.password);

        const buyerRole = await Role.findOne({ name: "buyer" });
        if (!buyerRole) {
            throw new ApiError("Default role not found. Contact admin.", 500);
        }

        const newUser = await userRepository.create({
            ...user,
            password,
            role: buyerRole._id,
            accountType: EAccountType.BASE,
            isActive: true,
            isDeleted: false,
        });

        const tokens = tokenService.generateTokens({
            userId: newUser._id.toString(),
            role: buyerRole.name,
        });

        await tokenRepository.create({ ...tokens, _userId: newUser._id });

        return { user: newUser, tokens };
    }

    public async signIn(
        dto: IAuth,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        const user = await userRepository.getByEmail(dto.email);

        if (
            !user ||
            !(await passwordService.comparePassword(
                dto.password,
                user.password,
            ))
        ) {
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        if (!user.isActive) {
            throw new ApiError(
                "Your account has been blocked by a moderator. Contact support.",
                StatusCodesEnum.FORBIDDEN,
            );
        }

        await tokenRepository.deleteByParams({ _userId: user._id });

        const userRole: IRole = user.role;
        const tokens = tokenService.generateTokens({
            userId: user._id.toString(),
            role: userRole.name,
        });

        await tokenRepository.create({ ...tokens, _userId: user._id });

        return { user, tokens };
    }

    public async refresh(
        payload: ITokenPayload,
        refreshToken: string,
    ): Promise<ITokenPair> {
        await tokenRepository.deleteByParams({ refreshToken });

        const tokens = tokenService.generateTokens({
            userId: payload.userId,
            role: payload.role,
        });

        await tokenRepository.create({ ...tokens, _userId: payload.userId });

        return tokens;
    }

    public async logout(userId: string): Promise<void> {
        await tokenRepository.deleteByParams({ _userId: userId });
    }
}

export const authService = new AuthService();
