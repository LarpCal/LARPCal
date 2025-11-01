import { DateTime } from "luxon";
import { LarpQuery } from "../types";

export const activeLarpQuery = {
  isPublished: true,
  endAfter: DateTime.now().toISO(),
} satisfies LarpQuery;

export const publishedLarpQuery = {
  isPublished: true,
  endAfter: DateTime.now().toISO(),
} satisfies LarpQuery;
