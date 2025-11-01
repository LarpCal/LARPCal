import React from "react";
import {
  Organization,
  UserForCreate,
  UserForUpdate,
  UserLoginData,
} from "../types";

export const ANON_USER: NullableUser = {
  username: null,
  firstName: null,
  lastName: null,
  email: null,
  isAdmin: null,
  organization: null,
  following: [],
};

export type NullableUser = {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isAdmin: boolean | null;
  organization: Organization | null;
  following: Pick<Organization, "id" | "orgName">[];
};

type UserContextType = {
  user: NullableUser;
  setUser: React.Dispatch<React.SetStateAction<NullableUser>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: (credentials: UserLoginData) => Promise<void>;
  logout: () => void;
  register: (userInfo: UserForCreate) => Promise<void>;
  update: (userInfo: UserForUpdate) => Promise<void>;
  loading: boolean;
  error: string[] | null;
};

export const userContext = React.createContext<UserContextType>({
  user: ANON_USER,
  setUser: () => {
    throw new Error("setUser function not provided");
  },
  token: null,
  setToken: () => {
    throw new Error("setToken function not provided");
  },
  login: async () => {
    throw new Error("login function not provided");
  },
  logout: () => {
    throw new Error("logout function not provided");
  },
  register: async () => {
    throw new Error("register function not provided");
  },
  update: async () => {
    throw new Error("update function not provided");
  },
  error: null,
  loading: false,
});
