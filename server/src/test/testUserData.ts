import { User } from "../types";
import { createToken } from "../utils/tokens";
import { testOrganization } from "./testOrgData";

const testUser: User = {
  id: 1,
  username: "testUser-username",
  password: "testUser-password",
  firstName: "testUser-first",
  lastName: "testUser-last",
  email: "testUser@test.com",
  organization: null,
  isAdmin: false,
};
const userToken = createToken(testUser);

const testOrganizerUser: User = {
  id: 2,
  username: "testOrganizerUser-username",
  password: "testOrganizerUser-password",
  firstName: "testOrganizerUser-first",
  lastName: "testOrganizerUser-last",
  email: "testOrganizerUser@test.com",
  organization: testOrganization,
  isAdmin: false,
};
const organizerToken = createToken(testOrganizerUser);

const testAdminUser: User = {
  id: 3,
  username: "testAdminUser-username",
  password: "testAdminUser-password",
  firstName: "testAdminUser-first",
  lastName: "testAdminUser-last",
  email: "testAdminUser@test.com",
  organization: null,
  isAdmin: true,
};
const adminToken = createToken(testAdminUser);

export {
  testOrganization,
  testUser,
  userToken,
  testOrganizerUser,
  organizerToken,
  testAdminUser,
  adminToken,
};
