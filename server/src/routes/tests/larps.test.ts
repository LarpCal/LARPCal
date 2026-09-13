import request from "supertest";
import app from "../../app";

import LarpManager from "../../models/LarpManager";
import { testLarp, testLarpForCreate } from "../../test/testLarpData";
import { organizerToken, testUser, userToken } from "../../test/testUserData";
import { omitKeys } from "../../utils/helpers";
import { vi } from "vitest";
import UserManager from "../../models/UserManager";
import { AttendanceStatusLabels } from "../../utils/attendance";

/************************** GET ALL **********************/
describe("GET events/", function () {
  test("OK", async function () {
    const mockedGetAllLarps = vi.spyOn(LarpManager, "getAllLarps");
    mockedGetAllLarps.mockResolvedValueOnce([testLarp]);

    const resp = await request(app).get("/events");

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetAllLarps).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      larps: [
        {
          ...testLarp,
          createdTime: testLarp.createdTime.toISOString(),
          start: testLarp.start.toISOString(),
          end: testLarp.end.toISOString(),
        },
      ],
    });
  });
});

/************************** GET BY ID **********************/
describe("GET events/:id", function () {
  test("OK", async function () {
    const mockedGetLarpById = vi.spyOn(LarpManager, "getLarpById");
    mockedGetLarpById.mockResolvedValue(testLarp);

    const mockedGetLarpAttendanceCountsById = vi.spyOn(
      LarpManager,
      "getLarpAttendanceCountsById",
    );
    mockedGetLarpAttendanceCountsById.mockResolvedValue({
      wanting: 0,
      going: 0,
    });

    const resp = await request(app).get("/events/1");

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetLarpById).toHaveBeenCalledTimes(2);
    expect(mockedGetLarpAttendanceCountsById).toHaveBeenCalled();
    expect(resp.body).toEqual({
      larp: {
        ...testLarp,
        createdTime: testLarp.createdTime.toISOString(),
        start: testLarp.start.toISOString(),
        end: testLarp.end.toISOString(),
      },
      attendance: {
        wanting: 0,
        going: 0,
      },
    });
  });
});

/************************** CREATE LARP **********************/
describe("POST events/:id", function () {
  test("OK", async function () {
    //mock lookup for auth middleware
    const mockedGetLarpById = vi.spyOn(LarpManager, "getLarpById");
    mockedGetLarpById.mockResolvedValueOnce(testLarp);
    //mock create
    const mockedCreateLarp = vi.spyOn(LarpManager, "createLarp");
    mockedCreateLarp.mockResolvedValueOnce(testLarp);
    const { ...createData } = testLarpForCreate;

    const resp = await request(app)
      .post(`/events/`)
      .send(createData)
      .set("authorization", `Bearer ${organizerToken}`);

    expect(resp.statusCode).toEqual(201);
    expect(mockedCreateLarp).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      larp: {
        ...testLarp,
        createdTime: testLarp.createdTime.toISOString(),
        start: testLarp.start.toISOString(),
        end: testLarp.end.toISOString(),
      },
    });
  });
});

/************************** UPDATE LARP **********************/
describe("PUT events/:id", function () {
  test("OK", async function () {
    //mock lookup for auth middleware
    const mockedGetLarpById = vi.spyOn(LarpManager, "getLarpById");
    mockedGetLarpById.mockResolvedValueOnce(testLarp);
    //mock update
    const mockedUpdateLarp = vi.spyOn(LarpManager, "updateLarp");
    const testLarpForUpdate = omitKeys(testLarp, "organization");
    const updateData = {
      ...testLarpForUpdate,
      title: "testLarp-updated",
    };
    mockedUpdateLarp.mockResolvedValueOnce({
      ...testLarp,
      title: "testLarp-updated",
    });

    const resp = await request(app)
      .put("/events/1")
      .send(updateData)
      .set("authorization", `Bearer ${organizerToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedUpdateLarp).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      larp: {
        ...testLarp,
        title: "testLarp-updated",
        createdTime: testLarp.createdTime.toISOString(),
        start: updateData.start.toISOString(),
        end: updateData.end.toISOString(),
      },
    });
  });
});

/************************** DELETE LARP **********************/
describe("DELETE events/:id", function () {
  test("OK", async function () {
    //mock lookup for auth middleware
    const mockedGetLarpById = vi.spyOn(LarpManager, "getLarpById");
    mockedGetLarpById.mockResolvedValueOnce(testLarp);
    //mock delete
    const mockedDeleteLarp = vi.spyOn(LarpManager, "deleteLarpById");
    mockedDeleteLarp.mockResolvedValueOnce(testLarp);

    const resp = await request(app)
      .delete("/events/1")
      .set("authorization", `Bearer ${organizerToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedDeleteLarp).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      deleted: {
        ...testLarp,
        createdTime: testLarp.createdTime.toISOString(),
        start: testLarp.start.toISOString(),
        end: testLarp.end.toISOString(),
      },
    });
  });
});

describe("GET events/:id/attendees", () => {
  test("OK", async () => {
    const mockedGetLarpById = vi.spyOn(LarpManager, "getLarpById");
    mockedGetLarpById.mockResolvedValue(testLarp);

    const attendees = [
      {
        username: testUser.username,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        status: "going" as AttendanceStatusLabels,
      },
    ];

    const mockedGetLarpAttendance = vi.spyOn(LarpManager, "getLarpAttendance");
    mockedGetLarpAttendance.mockResolvedValue(attendees);

    const resp = await request(app)
      .get("/events/1/attendees")
      .set("authorization", `Bearer ${organizerToken}`);

    expect(resp.status).toEqual(200);
    expect(mockedGetLarpAttendance).toHaveBeenCalled();
    expect(resp.body).toEqual({ attendees });
  });
});

describe("PUT events/:id/attend", () => {
  test("OK", async () => {
    const mockedGetLarpById = vi.spyOn(LarpManager, "getLarpById");
    mockedGetLarpById.mockResolvedValue(testLarp);

    const mockedGetUser = vi.spyOn(UserManager, "getUser");
    mockedGetUser.mockResolvedValue(testUser);

    const mockedUpdateLarpAttendance = vi.spyOn(
      LarpManager,
      "updateLarpAttendance",
    );
    mockedUpdateLarpAttendance.mockResolvedValue({ wanting: 0, going: 1 });

    const resp = await request(app)
      .put("/events/1/attend")
      .send({ status: "going" })
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetUser).toHaveBeenCalled();
    expect(mockedUpdateLarpAttendance).toHaveBeenCalled();
    expect(resp.body).toEqual({
      id: testLarp.id,
      attendance: "going",
      attendees: {
        going: 1,
        wanting: 0,
      },
    });
  });
});

describe("PUT events/:id/attend/:username", () => {
  test("OK", async () => {
    const mockedGetLarpById = vi.spyOn(LarpManager, "getLarpById");
    mockedGetLarpById.mockResolvedValue(testLarp);

    const mockedGetUser = vi.spyOn(UserManager, "getUser");
    mockedGetUser.mockResolvedValue(testUser);

    const mockedUpdateLarpAttendance = vi.spyOn(
      LarpManager,
      "updateLarpAttendance",
    );
    mockedUpdateLarpAttendance.mockResolvedValue({ wanting: 0, going: 1 });

    const resp = await request(app)
      .put(`/events/1/attend/${testUser.username}`)
      .send({ status: "going" })
      .set("authorization", `Bearer ${organizerToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetUser).toHaveBeenCalled();
    expect(mockedUpdateLarpAttendance).toHaveBeenCalled();
    expect(resp.body).toEqual({
      id: testLarp.id,
      attendance: "going",
      attendees: {
        going: 1,
        wanting: 0,
      },
    });
  });
});
