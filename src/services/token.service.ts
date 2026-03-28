import jwt, { Secret } from "jsonwebtoken";

import { config } from "../configs/config.js";
import { StatusCodesEnum } from "../enums/sc.enum.js";
import { TokenTypeEnum } from "../enums/token-type.enum.js";
import { ApiError } from "../errors/api.error.js";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface.js";
import { tokenRepository } from "../repositories/token.repository.js";

class TokenService {
    public generateTokens(payload: ITokenPayload): ITokenPair {
        const accessSecret = config.JWT_ACCESS_SECRET as Secret;
        const refreshSecret = config.JWT_REFRESH_SECRET as Secret;

        const accessToken = jwt.sign(payload, accessSecret, {
            expiresIn: config.JWT_ACCESS_LIFETIME,
        } as any);

        const refreshToken = jwt.sign(payload, refreshSecret, {
            expiresIn: config.JWT_REFRESH_LIFETIME,
        } as any);

        return {
            accessToken,
            refreshToken,
        };
    }

    public checkToken(
        token: string,
        type: "access" | "refresh",
    ): ITokenPayload {
        const tokenType =
            type === "access" ? TokenTypeEnum.ACCESS : TokenTypeEnum.REFRESH;
        return this.verifyToken(token, tokenType);
    }

    public verifyToken(token: string, type: TokenTypeEnum): ITokenPayload {
        try {
            let secret: string;

            switch (type) {
                case TokenTypeEnum.ACCESS:
                    secret = config.JWT_ACCESS_SECRET;
                    break;
                case TokenTypeEnum.REFRESH:
                    secret = config.JWT_REFRESH_SECRET;
                    break;
                default:
                    throw new ApiError(
                        "Invalid token type",
                        StatusCodesEnum.BAD_REQUEST,
                    );
            }

            return jwt.verify(token, secret as Secret) as ITokenPayload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            throw new ApiError("Invalid token", StatusCodesEnum.UNAUTHORIZED);
        }
    }

    public async isTokenExists(
        token: string,
        type: TokenTypeEnum,
    ): Promise<boolean> {
        const tokenKey =
            type === TokenTypeEnum.ACCESS ? "accessToken" : "refreshToken";
        const tokenInDb = await tokenRepository.findByParams({
            [tokenKey]: token,
        });
        return !!tokenInDb;
    }
}

export const tokenService = new TokenService();
