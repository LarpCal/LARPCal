import { Response } from "express";
import { BadRequestError } from "./expressError";

export function omitKeys<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function toValidId(id: string | undefined) {
  if (!id) {
    throw new BadRequestError("ID is undefined");
  }
  const parsedId = Number.parseInt(id);
  if (isNaN(parsedId) || parsedId <= 0) {
    throw new BadRequestError("Invalid ID");
  }
  return parsedId;
}

export function toValidUsername(res: Response): string {
  const username = res.locals.user?.username;
  if (!username || typeof username !== "string") {
    throw new BadRequestError("Invalid username");
  }
  return username;
}

export function isStringArray(array: unknown): array is string[] {
  return (
    Array.isArray(array) &&
    array.length > 0 &&
    array.every((item) => typeof item === "string")
  );
}

export function isEmailArray(array: unknown): array is string[] {
  if (!isStringArray(array)) {
    return false;
  }
  return array.every((item) => item.includes("@") && item.includes("."));
}
