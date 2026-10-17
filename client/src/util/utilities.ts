import { LarpQuery, TicketStatus } from "../types";

//Checks if a string is a valid url
export function isURL(string?: string) {
  if (!string) return false;
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**Given an object and a path(string) returns the value from that object at the
 * position indicated in the path
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNested(obj: unknown, path: string): any {
  const keys = path.split(/[.[\]'"]/).filter((p) => p);
  return keys.reduce((accumulator: unknown, currentKey: string) => {
    // Using type assertion to indicate that accumulator is indexable
    if (
      accumulator &&
      typeof accumulator === "object" &&
      currentKey in (accumulator as Record<string, unknown>)
    ) {
      return (accumulator as Record<string, unknown>)[currentKey];
    } else {
      // Return undefined or throw an error if the path does not exist
      return undefined;
    }
  }, obj);
}

/** Takes a string and a number n.  Returns the first n characters of the string
 * plus the remaining characters in the final word
 *
 *  ("an example of the output",2)=> "an"
 *  ("an example of the output",3)=> "an example"
 *  ("an example of the output",11)=> "an example of"
 */

export function shortenString(str: string, n: number) {
  if (str.length <= n) return str;
  const shortStr = `${str.split(" ").reduce((acc, curr, i) => {
    return acc.length + i < n ? `${acc} ${curr}` : acc;
  })}`;
  return `${shortStr}...`;
}

export function formatTicketStatus(status: TicketStatus) {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "LIMITED":
      return "Few remaining";
    case "SOLD_OUT":
      return "Closed";
    case "SOON":
      return "Coming soon";
    default:
      return status;
  }
}

const LARP_QUERY_BOOLEAN_KEYS = ["isFeatured", "isPublished"];

export function larpQueryToSearchParams(query: LarpQuery) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });
  return params;
}

export function searchParamsToLarpQuery(params: URLSearchParams): LarpQuery {
  const query: Record<string, unknown> = {};
  for (const key of new Set(params.keys())) {
    if (key === "page") {
      continue;
    }
    const values = params.getAll(key);
    if (LARP_QUERY_BOOLEAN_KEYS.includes(key)) {
      query[key] = values[0] === "true";
    } else if (key === "orgId") {
      const orgId = Number.parseInt(values[0]);
      if (!isNaN(orgId)) {
        query[key] = orgId;
      }
    } else {
      query[key] = values.length > 1 ? values : values[0];
    }
  }
  return query as LarpQuery;
}
