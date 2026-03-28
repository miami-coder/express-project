import joi from "joi";

import { EAccountType } from "../enums/account-type.enum.js";
import { RegexEnum } from "../enums/regex.enum.js";
import { UserQueryOrderEnum } from "../enums/user-query-order.enum.js";
import { EUserRole } from "../enums/user-role.enum.js";

export class UserValidator {
    private static email = joi.string().email().trim();
    private static password = joi.string().regex(RegexEnum.PASSWORD);
    private static name = joi.string().regex(RegexEnum.NAME);
    private static surname = joi.string().regex(RegexEnum.NAME);
    private static age = joi.number().min(2).max(100);
    private static role = joi.string().valid(...Object.values(EUserRole));
    private static accountType = joi
        .string()
        .valid(...Object.values(EAccountType));

    public static create = joi.object({
        email: this.email.required(),
        password: this.password.required(),
        name: this.name.required(),
        surname: this.surname.required(),
        age: this.age.required(),
        role: this.role.default(EUserRole.BUYER),
        accountType: this.accountType.default(EAccountType.BASE),
    });

    public static update = joi.object({
        name: this.name.required(),
        surname: this.surname.required(),
        age: this.age.required(),
    });

    public static query = joi.object({
        pageSize: joi.number().min(1).max(100).default(10),
        page: joi.number().min(1).default(1),
        search: joi.string().trim(),
        order: joi
            .string()
            .valid(
                ...Object.values(UserQueryOrderEnum),
                ...Object.values(UserQueryOrderEnum).map((item) => `-${item}`),
            ),
    });
}
