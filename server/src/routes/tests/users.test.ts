import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app';

import UserManager from '../../models/UserManager';
import {
  testUser,
  userToken,
  testAdminUser,
  adminToken,
  testOrganizerUser,
  organizerToken,
} from '../../test/testUserData';

beforeEach(jest.clearAllMocks);

/************************** GET ALL **********************/
describe('GET users/', function () {
  test('OK', async function () {
    const { password, ...publicTestUser } = testUser;

    const mockedGetAllUsers = jest.spyOn(UserManager, 'findAll');
    mockedGetAllUsers.mockResolvedValueOnce([publicTestUser]);

    const resp = await request(app)
      .get('/users')
      .set('authorization', `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetAllUsers).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      users: [
        {
          ...publicTestUser,
        },
      ],
    });
  });
});
``;

/************************** GET BY ID **********************/
describe('GET users/:username', function () {
  test('OK', async function () {
    const mockedGetUser = jest.spyOn(UserManager, 'getUser');
    mockedGetUser.mockResolvedValueOnce(testUser);

    const resp = await request(app)
      .get(`/users/${testUser.username}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedGetUser).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      user: testUser,
    });
  });
});

/************************** CREATE USER **********************/
describe('POST users/', function () {
  test('OK', async function () {
    //mock create
    const mockedRegister = jest.spyOn(UserManager, 'register');
    mockedRegister.mockResolvedValueOnce(testAdminUser);
    const { id, organization, ...createData } = testAdminUser;

    const resp = await request(app)
      .post(`/users/`)
      .send(createData)
      .set('authorization', `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(201);
    expect(mockedRegister).toHaveBeenCalledTimes(1);
    expect(resp.body.user).toEqual(testAdminUser);
    expect(typeof resp.body.token).toEqual('string');
  });
});

/************************** UPDATE USER **********************/
describe('PATCH users/:username', function () {
  test('OK', async function () {
    //mock lookup for auth middleware
    const mockedGetUser = jest.spyOn(UserManager, 'getUser');
    mockedGetUser.mockResolvedValueOnce(testUser);

    //mock update
    const updateData = {
      firstName: 'testUser-updatedFirst',
    };
    const mockedUpdateUser = jest.spyOn(UserManager, 'updateUser');
    mockedUpdateUser.mockResolvedValueOnce({
      ...testUser,
      firstName: 'testUser-updatedFirst',
    });

    const resp = await request(app)
      .patch(`/users/${testUser.username}`)
      .send(updateData)
      .set('authorization', `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      user: {
        ...testUser,
        firstName: 'testUser-updatedFirst',
      },
    });
  });
});

/************************** DELETE LARP **********************/
describe('DELETE users/:username', function () {
  test('OK', async function () {
    //mock lookup for auth middleware
    const mockedGetUser = jest.spyOn(UserManager, 'getUser');
    mockedGetUser.mockResolvedValueOnce(testUser);

    //mock delete
    const mockedDeleteUser = jest.spyOn(UserManager, 'deleteUser');
    mockedDeleteUser.mockResolvedValueOnce(testUser.username);

    const resp = await request(app)
      .delete(`/users/${testUser.username}`)
      .set('authorization', `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(mockedDeleteUser).toHaveBeenCalledTimes(1);
    expect(resp.body).toEqual({
      deleted: testUser.username,
    });
  });
});
