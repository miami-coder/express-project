import { Types } from "mongoose";

import { IBase } from "./base.interface.js";

export interface IModel extends IBase {
    name: string;
    brandId: Types.ObjectId | string;
}
