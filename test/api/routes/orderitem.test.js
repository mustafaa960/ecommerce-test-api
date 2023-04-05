import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import OrderItemService from "../../../src/services/orderitem.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/orderitem.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/order-item/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/order-item");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    OrderItemService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/order-item")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(OrderItemService.list).toHaveBeenCalled();
  });

  test("POST creates a new OrderItem", async () => {
    const data = {
      order: 1,
      product: 1,
      price: 3.141592,
    };

    OrderItemService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/order-item")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(OrderItemService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new OrderItem without required attributes fails", async () => {
    const data = {};

    OrderItemService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/order-item")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(OrderItemService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/order-item/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    OrderItemService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/order-item/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(OrderItemService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/order-item/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    OrderItemService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/order-item/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(OrderItemService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    OrderItemService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/order-item/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(OrderItemService.get).not.toHaveBeenCalled();
  });

  test("OrderItem update", async () => {
    const data = {
      order: 1,
      product: 1,
      price: 3.141592,
    };
    OrderItemService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/order-item/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(OrderItemService.update).toHaveBeenCalledWith(1, data);
  });

  test("OrderItem deletion", async () => {
    OrderItemService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/order-item/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(OrderItemService.delete).toHaveBeenCalledWith(1);
  });
});
