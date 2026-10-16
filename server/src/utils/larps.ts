import { CORS_URL } from "../config.ts";

export function larpIdToUrl(id: number) {
  return `${CORS_URL}/events/${id}`;
}
