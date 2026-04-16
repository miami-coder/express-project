import { IBase } from "./base.interface.js";

export interface IBrand extends IBase {
    _id?: string;
    name: string;
    models: string[];
}
