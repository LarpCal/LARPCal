import { FC, useMemo } from "react";
import { DateTime as LuxonDateTime } from "luxon";

export const DateTimeFormat: FC<{
  children?: string | Date;
  time?: boolean;
}> = ({ children, time = false }) => {
  const text = useMemo(() => {
    if (!children) {
      return "";
    }
    const dt =
      typeof children === "string"
        ? LuxonDateTime.fromISO(children)
        : LuxonDateTime.fromJSDate(children);
    return dt.toLocaleString(
      time ? LuxonDateTime.DATETIME_MED : LuxonDateTime.DATE_MED,
    );
  }, [children, time]);

  return <>{text}</>;
};
