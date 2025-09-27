import { DateTime } from "luxon";
import type { Larp, LarpAsJSON } from "../types";

function JsonToLarp(data: LarpAsJSON): Larp {
  return {
    ...data,
    id: data.id!,
    start: new Date(data.start),
    end: new Date(data.end),
    createdTime: new Date(data.createdTime),
  };
}

/** Converts Luxon DateTime to JS Date */
function LuxonToJSDate(luxonDateTime: DateTime): Date {
  return luxonDateTime.toJSDate();
}

/** Converts JS Date to Luxon DateTime */
function JSDateToLuxon(jsDate: Date): DateTime {
  return DateTime.fromJSDate(jsDate);
}

export { JsonToLarp, JSDateToLuxon, LuxonToJSDate };
