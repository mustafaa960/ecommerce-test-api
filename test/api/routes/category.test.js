import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import CategoryService from "../../../src/services/category.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/category.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/category/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/category");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    CategoryService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/category")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(CategoryService.list).toHaveBeenCalled();
  });

  test("POST creates a new Category", async () => {
    const data = {
      name: "test",
    };

    CategoryService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/category")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(CategoryService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Category without required attributes fails", async () => {
    const data = {};

    CategoryService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/category")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(CategoryService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/category/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    CategoryService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/category/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CategoryService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/category/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    CategoryService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/category/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(CategoryService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    CategoryService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/category/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(CategoryService.get).not.toHaveBeenCalled();
  });

  test("Category update", async () => {
    const data = {
      name: "test",
    };
    CategoryService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/category/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CategoryService.update).toHaveBeenCalledWith(1, data);
  });

  test("Category deletion", async () => {
    CategoryService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/category/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(CategoryService.delete).toHaveBeenCalledWith(1);
  });
});
