import joi from "joi";

import { RegexEnum } from "../enums/regex.enum.js";

export class UserValidator {
    private static email = joi.string().email().trim();
    private static password = joi.string().regex(RegexEnum.PASSWORD);
    private static name = joi.string().regex(RegexEnum.NAME);

    public static create = joi
        .object({
            name: this.name.required(),
            email: this.email.required(),
            password: this.password.required(),
        })
        .messages({
            "string.pattern.base": "Invalid email or password",
            "string.email": "Invalid email or password",
            "any.required": "Invalid email or password",
            "string.min": "Invalid email or password",
        });

    public static login = joi.object({
        email: this.email.required(),
        password: this.password.required(),
    });
}
