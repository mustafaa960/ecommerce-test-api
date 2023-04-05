import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import RoleService from "../../../src/services/role.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/role.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/role/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/role");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    RoleService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req.get("/api/v1/role").set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(RoleService.list).toHaveBeenCalled();
  });

  test("POST creates a new Role", async () => {
    const data = {
      field1: "test",
    };

    RoleService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/role")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(RoleService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/role/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    RoleService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/role/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(RoleService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/role/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    RoleService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/role/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(RoleService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    RoleService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/role/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(RoleService.get).not.toHaveBeenCalled();
  });

  test("Role update", async () => {
    const data = {};
    RoleService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/role/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(RoleService.update).toHaveBeenCalledWith(1, data);
  });

  test("Role deletion", async () => {
    RoleService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/role/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(RoleService.delete).toHaveBeenCalledWith(1);
  });
});
