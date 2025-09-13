import { Larp, LarpForCreate, Tag } from '../types';
import { testOrganization } from './testOrgData';
import { testImgSet } from './testImgSet';

const START = new Date();
const END = new Date(START.getTime() + 1 * 24 * 60 * 60 * 1000);

const testTag: Tag = {
  name: 'testTag',
};

const testLarpForCreate: LarpForCreate = {
  orgId: testOrganization.id,
  title: 'testLarp-title',
  ticketStatus: 'AVAILABLE',
  tags: [testTag],
  start: START,
  end: END,
  allDay: false,
  city: 'testLarp-city',
  country: 'testLarp-country',
  language: 'testLarp-language',
  description: 'testLarp-description',
  eventUrl: 'https://testLarp.com',
};

const testLarp: Larp = {
  id: 1,
  title: 'testLarp-title',
  ticketStatus: 'AVAILABLE',
  tags: [testTag],
  start: START,
  end: END,
  allDay: false,
  imgUrl: testImgSet,
  imgSetId: 1,
  city: 'testLarp-city',
  country: 'testLarp-country',
  language: 'testLarp-language',
  description: 'testLarp-description',
  orgId: testOrganization.id,
  organization: testOrganization,
  eventUrl: 'https://testLarp.com',
  isFeatured: false,
  createdTime: START,
  isPublished: true,
};

export { testTag, testLarpForCreate, testLarp };
