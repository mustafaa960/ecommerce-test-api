import { Order } from "../models/init.js";
import DatabaseError from "../models/error.js";

function prepareData(data) {
  return {
    ...data,
    user:
      data.user !== undefined
        ? {
            connect: { id: data.user },
          }
        : undefined,
  };
}

class OrderService {
  static async list() {
    try {
      return Order.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Order.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Order.create({ data: prepareData(data) });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Order.update({
        where: { id },
        data: prepareData(data),
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Order.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default OrderService;
