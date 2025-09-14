import { Organization } from "../types";
import { testImgSet } from "./testImgSet";

const testOrganization: Organization = {
  id: 1,
  username: "testOrganizerUser-username",
  orgName: "testOrg-orgname",
  orgUrl: "https://testLarp.com/orgUrl",
  imgSetId: 1,
  imgUrl: testImgSet,
  description: "testOrg-description",
  email: "testOrg@test.com",
  isApproved: true,
};

export { testOrganization };
