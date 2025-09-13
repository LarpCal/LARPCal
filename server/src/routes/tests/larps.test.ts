import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app';

import LarpManager from '../../models/LarpManager';
import { testLarp, testLarpForCreate, testTag } from '../../test/testLarpData';
import { organizerToken } from '../../test/testUserData';

beforeEach(jest.clearAllMocks);

/************************** GET ALL **********************/
describe('GET events/', function () {
  test('OK', async function () {
    const mockedGetAllLarps = jest.spyOn(LarpManager, 'getAllLarps');
    mockedGetAllLarps.mockResolvedValueOnce([testLarp]);

    const resp = await request(app).get('/events');

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetAllLarps).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      larps: [
        {
          ...testLarp,
          start: testLarp.start.toISOString(),
          end: testLarp.end.toISOString(),
        },
      ],
    });
  });
});

/************************** GET BY ID **********************/
describe('GET events/:id', function () {
  test('OK', async function () {
    const mockedGetLarpById = jest.spyOn(LarpManager, 'getLarpById');
    mockedGetLarpById.mockResolvedValueOnce(testLarp);

    const resp = await request(app).get('/events/1');

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetLarpById).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      larp: {
        ...testLarp,
        start: testLarp.start.toISOString(),
        end: testLarp.end.toISOString(),
      },
    });
  });
});

/************************** CREATE LARP **********************/
describe('POST events/:id', function () {
  test('OK', async function () {
    //mock lookup for auth middleware
    const mockedGetLarpById = jest.spyOn(LarpManager, 'getLarpById');
    mockedGetLarpById.mockResolvedValueOnce(testLarp);
    //mock create
    const mockedCreateLarp = jest.spyOn(LarpManager, 'createLarp');
    mockedCreateLarp.mockResolvedValueOnce(testLarp);
    const { ...createData } = testLarpForCreate;

    const resp = await request(app)
      .post(`/events/`)
      .send(createData)
      .set('authorization', `Bearer ${organizerToken}`);

    expect(resp.statusCode).toEqual(201);
    expect(mockedCreateLarp).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      larp: {
        ...testLarp,
        start: testLarp.start.toISOString(),
        end: testLarp.end.toISOString(),
      },
    });
  });
});

/************************** UPDATE LARP **********************/
describe('PUT events/:id', function () {
  test('OK', async function () {
    //mock lookup for auth middleware
    const mockedGetLarpById = jest.spyOn(LarpManager, 'getLarpById');
    mockedGetLarpById.mockResolvedValueOnce(testLarp);
    //mock update
    const mockedUpdateLarp = jest.spyOn(LarpManager, 'updateLarp');
    const { organization, ...testLarpForUpdate } = testLarp;
    const updateData = {
      ...testLarpForUpdate,
      title: 'testLarp-updated',
    };
    mockedUpdateLarp.mockResolvedValueOnce({
      ...testLarp,
      title: 'testLarp-updated',
    });

    const resp = await request(app)
      .put('/events/1')
      .send(updateData)
      .set('authorization', `Bearer ${organizerToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedUpdateLarp).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      larp: {
        ...testLarp,
        title: 'testLarp-updated',
        start: updateData.start.toISOString(),
        end: updateData.end.toISOString(),
      },
    });
  });
});

/************************** DELETE LARP **********************/
describe('DELETE events/:id', function () {
  test('OK', async function () {
    //mock lookup for auth middleware
    const mockedGetLarpById = jest.spyOn(LarpManager, 'getLarpById');
    mockedGetLarpById.mockResolvedValueOnce(testLarp);
    //mock delete
    const mockedDeleteLarp = jest.spyOn(LarpManager, 'deleteLarpById');
    mockedDeleteLarp.mockResolvedValueOnce(testLarp);

    const resp = await request(app)
      .delete('/events/1')
      .set('authorization', `Bearer ${organizerToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedDeleteLarp).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      deleted: {
        ...testLarp,
        start: testLarp.start.toISOString(),
        end: testLarp.end.toISOString(),
      },
    });
  });
});
