import { Brand } from "../models/brand.model.js";

class BrandRepository {
    public async getAll() {
        return await Brand.find();
    }

    public async getByName(name: string) {
        return await Brand.findOne({ name: name.toUpperCase() });
    }
}

export const brandRepository = new BrandRepository();
