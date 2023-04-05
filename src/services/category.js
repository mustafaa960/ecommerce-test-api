import { Category } from "../models/init.js";
import DatabaseError from "../models/error.js";

class CategoryService {
  static async list() {
    try {
      return Category.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Category.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Category.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Category.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Category.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default CategoryService;
