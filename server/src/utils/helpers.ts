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
    throw new Error("ID is undefined");
  }
  const parsedId = Number.parseInt(id);
  if (isNaN(parsedId) || parsedId <= 0) {
    throw new Error("Invalid ID");
  }
  return parsedId;
}
