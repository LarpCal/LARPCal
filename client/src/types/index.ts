type PartialWithRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

export type Tag = {
  id: number;
  name: string;
};

export type ImageSet = {
  sm: string;
  md: string;
  lg: string;
};

/*************************** LARPS */
export type TicketStatus = 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT' | 'SOON';

export type LarpForCreate = {
  title: string;
  ticketStatus: TicketStatus;
  tags: Tag[];
  start: Date;
  end: Date;
  allDay: boolean;
  city: string;
  country: string;
  language: string;
  description: string;
  orgId: number;
  eventUrl: string;
};

export type Larp = LarpForCreate & {
  id: number;
  imgUrl: ImageSet;
  imgSetId: number;
  organization: Organization;
  isFeatured: boolean;
  createdTime: Date;
  isPublished: boolean;
};

export type LarpForUpdate = Omit<
  PartialWithRequired<Larp, 'id'>,
  'organization'
>;

export type LarpAsJSON = LarpForCreate & {
  id?: number;
  start: string;
  end: string;
  imgUrl: ImageSet;
  imgSetId: number;
  organization: Organization;
  isFeatured: boolean;
  createdTime: string;
  isPublished: boolean;
};

/*************************** LARP QUERY */
export type LarpQuery = {
  term?: string;
  title?: string;
  ticketStatus?: TicketStatus | '';
  tags?: string;
  startBefore?: string;
  startAfter?: string;
  endBefore?: string;
  endAfter?: string;
  city?: string;
  country?: string;
  language?: string;
  org?: string;
  isFeatured?: boolean;
  createdBefore?: string;
  createdAfter?: string;
  isPublished?: boolean;
};

/*************************** USERS */

export type UserLoginData = {
  username: string;
  password: string;
};

export type UserForCreate = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type User = UserForCreate & {
  isAdmin: boolean;
  id: number;
  organization: Organization | null;
};

export type PublicUser = Omit<User, 'password'>;

export type UserForUpdate = PartialWithRequired<
  Omit<User, 'organization'>,
  'id' | 'username'
>;

/*************************** ORGANIZATIONS */

export type OrganizationForCreate = {
  username: string;
  orgName: string;
  orgUrl: string;
  description: string;
  email: string;
};

export type Organization = OrganizationForCreate & {
  id: number;
  isApproved: boolean;
  imgUrl: ImageSet;
  imgSetId: number;
  larps: Larp[];
};

export type OrganizationForUpdate = Omit<
  PartialWithRequired<Organization, 'id'>,
  'larps'
>;

/*************************** AUTH */

export type PasswordResetRequest = {
  id: number;
  username: string;
  user: { email: string };
  createdAt: Date;
};
