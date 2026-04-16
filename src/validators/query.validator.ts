import joi from "joi";

export class QueryValidator {
    public static pagination = joi.object({
        page: joi.number().integer().min(1).default(1),
        pageSize: joi.number().integer().min(1).max(100).default(10),
        search: joi.string().trim().allow("").default(""),
        order: joi.string().trim().default("createdAt"),
    });
}
