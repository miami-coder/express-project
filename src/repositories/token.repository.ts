// @ts-ignore
import { FilterQuery } from "mongoose";

import { IToken } from "../interfaces/token.interface.js";
import { Token } from "../models/token.model.js";

class TokenRepository {
    public async findOne(filter: FilterQuery<IToken>): Promise<IToken | null> {
        return await Token.findOne(filter);
    }

    public async findByParams(
        filter: FilterQuery<IToken>,
    ): Promise<IToken | null> {
        return await Token.findOne(filter);
    }

    public async create(data: Partial<IToken>): Promise<IToken> {
        return await Token.create(data);
    }

    public async deleteOne(filter: FilterQuery<IToken>): Promise<void> {
        await Token.deleteOne(filter);
    }

    public async deleteMany(filter: FilterQuery<IToken>): Promise<void> {
        await Token.deleteMany(filter);
    }

    public async deleteByParams(filter: FilterQuery<IToken>): Promise<void> {
        await this.deleteMany(filter);
    }
}

export const tokenRepository = new TokenRepository();
