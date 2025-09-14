import { DateTime } from "luxon";
import { LarpQuery } from "../types";
import { base64Decode, base64Encode } from "./utilities";

function filterToQuery(filter: LarpQuery): string {
  return base64Encode(JSON.stringify(filter));
}

function queryToFilter(query: string): LarpQuery {
  return JSON.parse(base64Decode(query));
}

const activeLarpQuery = filterToQuery({
  isPublished: true,
  endAfter: DateTime.now().toISO(),
});

const publishedLarpQuery = filterToQuery({
  isPublished: true,
  endAfter: DateTime.now().toISO(),
});

export { filterToQuery, queryToFilter, activeLarpQuery, publishedLarpQuery };
