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
import { afterEach, describe, expect, test, vi } from "vitest";
import LarpManager from "../../models/LarpManager";
import { testLarp } from "../../test/testLarpData";
import { UserLarpVisibility } from "../../types";

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

describe("GET users/:username/larps", () => {
  test("OK", async () => {
    const mockedGetUserLarpVisibility = vi.spyOn(
      UserManager,
      "getUserLarpVisibility",
    );
    mockedGetUserLarpVisibility.mockResolvedValueOnce({
      listing: false,
      past: false,
      future: true,
    });

    const mockedGetLarpsByUsername = vi.spyOn(
      LarpManager,
      "getLarpsByUsername",
    );
    mockedGetLarpsByUsername.mockResolvedValue([testLarp]);

    const resp = await request(app)
      .get(`/users/${testUser.username}/larps`)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetLarpsByUsername).toHaveBeenCalled();
    expect(resp.body).toEqual({
      past: null,
      future: [
        {
          ...testLarp,
          createdTime: testLarp.createdTime.toISOString(),
          start: testLarp.start.toISOString(),
          end: testLarp.end.toISOString(),
        },
      ],
      visibility: {
        listing: false,
        future: true,
        past: false,
      },
    });
  });
});

describe("PUT users/:username/larps", () => {
  test("OK", async () => {
    const mockedGetUser = vi.spyOn(UserManager, "getUser");
    mockedGetUser.mockResolvedValueOnce(testUser);

    const mockedUpdateUserLarpVisibility = vi.spyOn(
      UserManager,
      "updateUserLarpVisibility",
    );
    mockedUpdateUserLarpVisibility.mockResolvedValue({
      listing: false,
      past: true,
      future: false,
    });

    const resp = await request(app)
      .put(`/users/${testUser.username}/larps`)
      .send({
        listing: false,
        past: true,
        future: false,
      } satisfies UserLarpVisibility)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.status).toBe(200);
    expect(mockedUpdateUserLarpVisibility).toHaveBeenCalledWith({
      username: testUser.username,
      listing: false,
      past: true,
      future: false,
    });
    expect(resp.body).toEqual({
      listing: false,
      past: true,
      future: false,
    });
  });
});
