import React from "react";
import {
  PublicUser,
  UserForCreate,
  UserForUpdate,
  UserLoginData,
} from "../types";

export const ANON_USER: NullableUser = {
  id: null,
  username: null,
  firstName: null,
  lastName: null,
  email: null,
  subscribed: false,
  isAdmin: null,
  organization: null,
  following: [],
};

export type NullableUser = {
  [K in keyof PublicUser]: PublicUser[K] | null;
};

type UserContextType = {
  user: NullableUser;
  login: (credentials: UserLoginData) => Promise<void>;
  logout: () => void;
  register: (userInfo: UserForCreate) => Promise<void>;
  update: (userInfo: UserForUpdate) => Promise<void>;
  refetch: () => Promise<void>;
  loading: boolean;
  error: string[] | null;
};

export const userContext = React.createContext<UserContextType>({
  user: ANON_USER,
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
  refetch: async () => {
    throw new Error("refetch function not provided");
  },
  error: null,
  loading: false,
});
