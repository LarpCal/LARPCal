import { UserToken } from ".";

declare global {
  namespace Express {
    interface Locals {
      user?: UserToken;
    }
  }
}

export {};
