import { config } from "../configs/config.js";
import { IBrand } from "../interfaces/brand.interface.js";
import { brandRepository } from "../repositories/brand.repository.js";
import { emailService } from "./email.service.js";

class BrandService {
    public async getAll(): Promise<IBrand[]> {
        return await brandRepository.getAll();
    }

    public async requestBrand(
        brandName: string,
        userName: string,
    ): Promise<void> {
        await emailService.sendBrandRequestEmail(config.SMTP_USER, {
            brandName,
            userName,
        });
    }
}

export const brandService = new BrandService();
