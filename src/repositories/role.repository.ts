import { IRole } from "../interfaces/role.interface.js";
import { Role } from "../models/role.model.js";

class RoleRepository {
    public async getByName(name: string): Promise<IRole | null> {
        return await Role.findOne({ name });
    }
}

export const roleRepository = new RoleRepository();
