
type PartialWithRequired<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

export type Tag = {
  name: string;
};

export type ImageSet = {
  sm:string;
  md:string;
  lg:string;
}

/*************************** LARPS */

export type TicketStatus = "AVAILABLE" | "LIMITED" | "SOLD_OUT";

export type LarpForCreate = {
  title: string,
  ticketStatus: TicketStatus,
  tags: Tag[],
  start: Date,
  end: Date,
  allDay: boolean,
  city: string,
  country: string,
  language: string,
  description: string,
  orgId: number,
  eventUrl: string,
};

export type Larp = LarpForCreate & {
  id: number;
  imgUrl: ImageSet;
  imgSetId: number;
  organization?: Organization;
};

export type LarpForUpdate = Omit<
  PartialWithRequired<Larp, 'id'>,
  'organization'
>;


/*************************** LARP QUERY */
export type LarpQuery = {
  term?: string;
  title?: string;
  ticketStatus?: TicketStatus;
  tags?: string
  startBefore?: string;
  startAfter?:string;
  endBefore?:string;
  endAfter?:string;
  city?: string;
  country?: string;
  language?: string;
  org?: string;
}

/*************************** USERS */

export type UserForCreate = {
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  isAdmin: boolean,
};

export type User = UserForCreate & {
  id: number;
  organization: Organization | null;
};

export type PublicUser = Omit<User, 'password'>;

export type UserForUpdate = (
  PartialWithRequired<
    Omit<
      User,
      'organization'
    >,
    'id' | 'username'
  >);

/*************************** ORGANIZATIONS */


export type OrganizationForCreate = {
  username: string;
  orgName: string;
  orgUrl: string;
  description: string;
  email: string;
};

export type Organization = OrganizationForCreate & {
  isApproved: boolean;
  imgUrl: ImageSet;
  imgSetId: number;
  id: number;
  larps?: Larp[];
};

export type OrganizationForUpdate = Omit<
  PartialWithRequired<Organization, 'id'>,
  'larps'
>;


