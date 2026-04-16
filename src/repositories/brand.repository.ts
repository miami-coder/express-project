import { IBrand } from "../interfaces/brand.interface.js";
import { Brand } from "../models/brand.model.js";

class BrandRepository {
    //for front
    public async getAll(): Promise<IBrand[]> {
        return (await Brand.find()
            .sort({ name: 1 })
            .lean()) as unknown as IBrand[];
    }

    public async getById(id: string): Promise<IBrand | null> {
        return (await Brand.findById(id).lean()) as unknown as IBrand | null;
    }
}

export const brandRepository = new BrandRepository();
