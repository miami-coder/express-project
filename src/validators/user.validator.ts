import joi from "joi";

import { EAccountType } from "../enums/account-type.enum.js";
import { RegexEnum } from "../enums/regex.enum.js";

export class UserValidator {
    private static email = joi.string().email().trim();
    private static password = joi.string().regex(RegexEnum.PASSWORD);
    private static name = joi.string().regex(RegexEnum.NAME);
    private static surname = joi.string().regex(RegexEnum.NAME);
    private static age = joi.number().min(2).max(100);
    private static role = joi.string().min(2).max(20).lowercase().trim();
    private static accountType = joi
        .string()
        .valid(...Object.values(EAccountType));

    public static create = joi.object({
        email: this.email.required(),
        password: this.password.required(),
        name: this.name.required(),
        surname: this.surname.required(),
        age: this.age.required(),
        role: this.role.optional().default("buyer"),
        accountType: this.accountType.default(EAccountType.BASE),
    });

    public static update = joi.object({
        name: this.name.optional(),
        surname: this.surname.optional(),
        age: this.age.optional(),
        avatar: joi.string().optional(),
    });
}
