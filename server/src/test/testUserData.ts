import { User } from "../types";
import { createToken } from "../utils/tokens";
import { testOrganization } from "./testOrgData";

export const testUser: User = {
  id: 1,
  username: "testUser-username",
  password: "testUser-password",
  firstName: "testUser-first",
  lastName: "testUser-last",
  email: "testUser@test.com",
  organization: null,
  isAdmin: false,
  subscribed: false,
  larpVisibility: {
    past: false,
    future: true,
  },
};
export const userToken = createToken(testUser);

export const testOrganizerUser: User = {
  ...testUser,
  id: 2,
  username: "testOrganizerUser-username",
  password: "testOrganizerUser-password",
  firstName: "testOrganizerUser-first",
  lastName: "testOrganizerUser-last",
  email: "testOrganizerUser@test.com",
  organization: testOrganization,
};
export const organizerToken = createToken(testOrganizerUser);

export const testAdminUser: User = {
  ...testUser,
  id: 3,
  username: "testAdminUser-username",
  password: "testAdminUser-password",
  firstName: "testAdminUser-first",
  lastName: "testAdminUser-last",
  email: "testAdminUser@test.com",
  isAdmin: true,
};
export const adminToken = createToken(testAdminUser);
