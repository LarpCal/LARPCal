import type { Larp, UserLarpVisibility } from "../types/index.ts";

export const ATTENDANCE_STATUS_NONE = 0;
export const ATTENDANCE_STATUS_WANTING = 1;
export const ATTENDANCE_STATUS_GOING = 2;

export const ATTENDANCE_STATUSES = {
  none: ATTENDANCE_STATUS_NONE,
  wanting: ATTENDANCE_STATUS_WANTING,
  going: ATTENDANCE_STATUS_GOING,
} as const;

export type AttendanceStatusLabels = keyof typeof ATTENDANCE_STATUSES;
export type AttendanceStatus =
  (typeof ATTENDANCE_STATUSES)[AttendanceStatusLabels];

export function isValidAttendanceStatus(
  input: unknown,
): input is AttendanceStatusLabels {
  return typeof input === "string" && input in ATTENDANCE_STATUSES;
}

export function attendanceStatusToLabel(
  status: number,
): AttendanceStatusLabels {
  switch (status) {
    case ATTENDANCE_STATUS_WANTING:
      return "wanting";
    case ATTENDANCE_STATUS_GOING:
      return "going";
    default:
      return "none";
  }
}

export const ATTENDANCE_VISIBILITY_NONE = 0x00;
export const ATTENDANCE_VISIBILITY_PAST = 0x01;
export const ATTENDANCE_VISIBILITY_FUTURE = 0x10;

export function userVisibility(visibilityBits: number): UserLarpVisibility {
  return {
    past: !!(visibilityBits & ATTENDANCE_VISIBILITY_PAST),
    future: !!(visibilityBits & ATTENDANCE_VISIBILITY_FUTURE),
  };
}

export function larpsToPastOrFuture(larps: Larp[]) {
  const future = [];
  const past = [];

  const now = new Date();
  for (const larp of larps) {
    if (larp.end >= now) {
      future.push(larp);
    } else {
      past.push(larp);
    }
  }

  return { future, past };
}
