import type { UserToken } from "./index.ts";

declare global {
  namespace Express {
    interface Locals {
      user?: UserToken;
    }
  }
}

export {};
