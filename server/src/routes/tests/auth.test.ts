import "../../config"; //this loads the test database
import request from "supertest";
import app from "../../app";
import UserManager from "../../models/UserManager";
import { testUser } from "../../test/testUserData";

beforeEach(jest.clearAllMocks);

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  const mockAuthenticate = jest.spyOn(UserManager, "authenticate");

  test("works", async function () {
    mockAuthenticate.mockResolvedValueOnce(testUser);

    const resp = await request(app).post("/auth/token").send({
      username: testUser.username,
      password: testUser.password,
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "no-such-user",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: testUser.username,
      password: "nope",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: testUser.username,
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: 42,
      password: "above-is-a-number",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

// /************************************** POST /auth/register */

describe("POST /auth/register", function () {
  const mockRegister = jest.spyOn(UserManager, "register");

  test("works for anon", async function () {
    mockRegister.mockResolvedValueOnce(testUser);

    const resp = await request(app).post("/auth/register").send({
      username: testUser.username,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      password: testUser.password,
      email: testUser.email,
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
    expect(mockRegister).toHaveBeenCalledWith({
      username: "testUser-username",
      firstName: "testUser-first",
      lastName: "testUser-last",
      password: "testUser-password",
      email: "testUser@test.com",
      isAdmin: false,
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: testUser.username,
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: testUser.username,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      password: testUser.password,
      email: "not-an-email",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
