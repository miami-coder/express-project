// @ts-ignore
import { FilterQuery } from "mongoose";

import { IToken } from "../interfaces/token.interface.js";
import { Token } from "../models/token.model.js";

class TokenRepository {
    public async findByParams(
        params: FilterQuery<IToken>,
    ): Promise<IToken | null> {
        return await Token.findOne(params);
    }

    public async create(data: Partial<IToken>): Promise<IToken> {
        return await Token.create(data);
    }

    public async deleteByParams(params: FilterQuery<IToken>): Promise<void> {
        await Token.deleteOne(params);
    }
}

export const tokenRepository = new TokenRepository();
