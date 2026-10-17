import type { LarpQuery } from "../types/index.ts";
import { BadRequestError } from "./expressError.ts";

const STRING_KEYS = [
  "term",
  "title",
  "tags",
  "startBefore",
  "startAfter",
  "endBefore",
  "endAfter",
  "city",
  "country",
  "language",
  "org",
  "createdBefore",
  "createdAfter",
] as const;

const BOOLEAN_KEYS = ["isFeatured", "isPublished"] as const;
const TICKET_STATUSES = ["AVAILABLE", "LIMITED", "SOLD_OUT", "SOON"] as const;

/** Builds a LarpQuery from plain query params. Returns undefined if no filters are present. */
export function parseLarpQuery(
  params: Record<string, unknown>,
): LarpQuery | undefined {
  const query: Record<string, unknown> = {};

  // Legacy base64-encoded JSON format
  if (typeof params.q === "string") {
    try {
      Object.assign(query, JSON.parse(atob(params.q)));
    } catch {
      throw new BadRequestError("Invalid query");
    }
  }

  for (const key of STRING_KEYS) {
    const value = params[key];
    if (typeof value === "string" && value.trim() !== "") {
      query[key] = value;
    }
  }

  for (const key of BOOLEAN_KEYS) {
    const value = params[key];
    if (value === "true" || value === "false") {
      query[key] = value === "true";
    }
  }

  if (typeof params.orgId === "string") {
    const orgId = Number.parseInt(params.orgId);
    if (isNaN(orgId)) {
      throw new BadRequestError("Invalid orgId");
    }
    query.orgId = orgId;
  }

  if (params.ticketStatus !== undefined) {
    const values = [params.ticketStatus].flat().filter((v) => v !== "");
    if (
      !values.every(
        (v) =>
          typeof v === "string" &&
          (TICKET_STATUSES as readonly string[]).includes(v),
      )
    ) {
      throw new BadRequestError("Invalid ticketStatus");
    }
    if (values.length > 0) {
      query.ticketStatus = values.length === 1 ? values[0] : values;
    }
  }

  return Object.keys(query).length > 0 ? (query as LarpQuery) : undefined;
}
