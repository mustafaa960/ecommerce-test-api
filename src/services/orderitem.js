import { OrderItem } from "../models/init.js";
import DatabaseError from "../models/error.js";

function prepareData(data) {
  return {
    ...data,
    order:
      data.order !== undefined
        ? {
            connect: { id: data.order },
          }
        : undefined,
    product:
      data.product !== undefined
        ? {
            connect: { id: data.product },
          }
        : undefined,
  };
}

class OrderItemService {
  static async list() {
    try {
      return OrderItem.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await OrderItem.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await OrderItem.create({ data: prepareData(data) });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await OrderItem.update({
        where: { id },
        data: prepareData(data),
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await OrderItem.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default OrderItemService;
