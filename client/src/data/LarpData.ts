import { ImageSet, Larp, Organization, Tag } from "../types";

const START = new Date();
const END = new Date(START.getTime() + 3 * 24 * 60 * 60 * 1000);

const Tag1: Tag = {
  id: 1,
  name: "Tag1",
};
const Tag2: Tag = {
  id: 2,
  name: "Tag2",
};

const testImageSet: ImageSet = {
  sm: "https://testLarp.com/testImage-sm",
  md: "https://testLarp.com/testImage-md",
  lg: "https://testLarp.com/testImage-lg",
};

const testOrganization: Organization = {
  id: 1,
  username: "testOrganizerUser-username",
  orgName: "testOrg-orgname",
  orgUrl: "https://testLarp.com/orgUrl",
  imgUrl: testImageSet,
  imgSetId: 1,
  description: "testOrg-description",
  email: "testOrg@test.com",
  isApproved: true,
  larps: [],
  followerCount: 0,
};

const TestLarp1: Larp = {
  id: 1,
  title: "Larp1 names can be long strings that take multiple lines",
  ticketStatus: "LIMITED",
  tags: [Tag1, Tag2],
  start: START,
  end: END,
  createdTime: START,
  allDay: false,
  imgUrl: testImageSet,
  imgSetId: 1,
  city: "Stratfordshire",
  country: "United Kingdom",
  language: "English",
  description: "This is a description of Larp1",
  organization: testOrganization,
  orgId: testOrganization.id,
  eventUrl: "https://test.com",
  isFeatured: false,
  isPublished: false,
};
const TestLarp2 = Object.create(TestLarp1);
TestLarp2.title = "Larp2";
TestLarp2.id = 2;
const TestLarp3 = Object.create(TestLarp1);
TestLarp3.title = "Larp3";
TestLarp3.id = 3;

export { TestLarp1, TestLarp2, TestLarp3 };
