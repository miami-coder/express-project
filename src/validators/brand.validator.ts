import joi from "joi";

export class BrandValidator {
    private static brandName = joi.string().min(2).max(50).trim();

    public static request = joi.object({
        brandName: this.brandName.required().messages({
            "string.empty": "Brand name cannot be empty",
            "string.min": "Brand name is too short",
        }),
    });
}
