import { IBase } from "./base.interface.js";

interface IToken extends IBase {
    _id: string;
    accessToken: string;
    refreshToken: string;
    _userId: string;
}

type ITokenPair = Pick<IToken, "accessToken" | "refreshToken">;

interface ITokenPayload {
    userId: string;
    role: string;
}

type IRefresh = Pick<IToken, "refreshToken">;

export { IRefresh, IToken, ITokenPair, ITokenPayload };
