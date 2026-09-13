import request from "supertest";
import app from "../../app";

import UserManager from "../../models/UserManager";
import {
  adminToken,
  testAdminUser,
  testUser,
  userToken,
} from "../../test/testUserData";
import { omitKeys } from "../../utils/helpers";
import { vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

/************************** GET ALL **********************/
describe("GET users/", function () {
  test("OK", async function () {
    const publicTestUser = omitKeys(testUser, "password");

    const mockedGetAllUsers = vi.spyOn(UserManager, "findAll");
    mockedGetAllUsers.mockResolvedValueOnce([publicTestUser]);

    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetAllUsers).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      users: [publicTestUser],
    });
  });
});

/************************** GET BY ID **********************/
describe("GET users/:username", function () {
  test("OK", async function () {
    const mockedGetUser = vi.spyOn(UserManager, "getUser");
    mockedGetUser.mockResolvedValueOnce(testUser);
    const mockedGetUserFollows = vi.spyOn(UserManager, "getUserFollows");
    mockedGetUserFollows.mockResolvedValueOnce([]);

    const resp = await request(app)
      .get(`/users/${testUser.username}`)
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetUser).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      user: {
        ...testUser,
        following: [],
      },
    });
  });
});

/************************** CREATE USER **********************/
describe("POST users/", function () {
  test("OK", async function () {
    //mock create
    const mockedRegister = vi.spyOn(UserManager, "register");
    mockedRegister.mockResolvedValueOnce(testAdminUser);
    const createData = omitKeys(testAdminUser, "id", "organization");

    const resp = await request(app)
      .post(`/users/`)
      .send(createData)
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(201);
    expect(mockedRegister).toHaveBeenCalledTimes(1);
    expect(resp.body.user).toEqual(testAdminUser);
    expect(typeof resp.body.token).toEqual("string");
  });
});

/************************** UPDATE USER **********************/
describe("PATCH users/:username", function () {
  test("OK", async function () {
    //mock lookup for auth middleware
    const mockedGetUser = vi.spyOn(UserManager, "getUser");
    mockedGetUser.mockResolvedValueOnce(testUser);

    //mock update
    const updateData = {
      firstName: "testUser-updatedFirst",
    };
    const mockedUpdateUser = vi.spyOn(UserManager, "updateUser");
    mockedUpdateUser.mockResolvedValueOnce({
      ...testUser,
      firstName: "testUser-updatedFirst",
    });

    const resp = await request(app)
      .patch(`/users/${testUser.username}`)
      .send(updateData)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      user: {
        ...testUser,
        firstName: "testUser-updatedFirst",
      },
    });
  });
});

/************************** DELETE LARP **********************/
describe("DELETE users/:username", function () {
  test("OK", async function () {
    //mock lookup for auth middleware
    const mockedGetUser = vi.spyOn(UserManager, "getUser");
    mockedGetUser.mockResolvedValueOnce(testUser);

    //mock delete
    const mockedDeleteUser = vi.spyOn(UserManager, "deleteUser");
    mockedDeleteUser.mockResolvedValueOnce(testUser.username);

    const resp = await request(app)
      .delete(`/users/${testUser.username}`)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedDeleteUser).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      deleted: testUser.username,
    });
  });
});
