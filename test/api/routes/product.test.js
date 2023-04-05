import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import ProductService from "../../../src/services/product.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/product.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/product/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/product");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    ProductService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/product")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(ProductService.list).toHaveBeenCalled();
  });

  test("POST creates a new Product", async () => {
    const data = {
      name: "test",
      description: "test",
      price: 3.141592,
      category: 1,
    };

    ProductService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/product")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(ProductService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Product without required attributes fails", async () => {
    const data = {};

    ProductService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/product")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(ProductService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/product/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    ProductService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/product/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(ProductService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/product/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    ProductService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/product/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(ProductService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    ProductService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/product/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(ProductService.get).not.toHaveBeenCalled();
  });

  test("Product update", async () => {
    const data = {
      name: "test",
      description: "test",
      price: 3.141592,
      category: 1,
    };
    ProductService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/product/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(ProductService.update).toHaveBeenCalledWith(1, data);
  });

  test("Product deletion", async () => {
    ProductService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/product/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(ProductService.delete).toHaveBeenCalledWith(1);
  });
});
