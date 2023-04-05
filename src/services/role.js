import { Role } from "../models/init.js";
import DatabaseError from "../models/error.js";

class RoleService {
  static async list() {
    try {
      return Role.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Role.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Role.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Role.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Role.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default RoleService;
