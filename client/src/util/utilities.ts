import { TicketStatus } from "../types";

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

//Encode a string to base64
export function base64Encode(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  let binary = "";
  data.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

//Decode base64 to get a string
export function base64Decode(encoded: string) {
  const binary = atob(encoded);
  const data = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    data[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(data);
}
