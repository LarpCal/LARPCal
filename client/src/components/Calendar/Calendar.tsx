import {
  Calendar as BigCalendar,
  CalendarProps as BigCalendarProps,
  luxonLocalizer,
  View,
} from "react-big-calendar";
import { DateTime } from "luxon";
import { EventProps } from "react-big-calendar";
import { Box, Modal } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import { Larp } from "../../types";
import EventDetails from "../Events/LarpDetails";
import { useFetchLarps } from "../../hooks/useFetchLarps";
import ToastMessage from "../ui/ToastMessage";

import CalendarEvent from "./CalendarEvent";
import "./Calendar.scss";

function Calendar() {
  const { larps, loading, error } = useFetchLarps({
    isPublished: true,
  });

  const [selected, setSelected] = useState<Larp | null>(null);
  const handleCloseDetails = useCallback(() => {
    setSelected(null);
  }, []);

  const [currentView, setCurrentView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState<Date | undefined>(
    () => new Date(),
  );

  const calProps = useMemo(
    () =>
      ({
        localizer: luxonLocalizer(DateTime, { firstDayOfWeek: 1 }),
        getNow: () => DateTime.local().toJSDate(),
        scrollToTime: DateTime.local().toJSDate(),
      }) satisfies BigCalendarProps,
    [],
  );

  if (loading) {
    return null;
  }

  return (
    <Box className="Calendar" style={{ position: "relative" }}>
      <ToastMessage
        title="Sorry, there was a problem fetching records for this page"
        messages={error?.message}
      />
      <Modal
        open={selected !== null}
        onClose={handleCloseDetails}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box className="Calendar-modal">
          {selected && <EventDetails larp={selected} />}
        </Box>
      </Modal>

      <BigCalendar
        {...calProps}
        events={larps}
        date={currentDate}
        onNavigate={setCurrentDate}
        view={currentView}
        views={["month", "week"]}
        onView={setCurrentView}
        startAccessor="start"
        endAccessor="end"
        components={{
          event: (props: EventProps<Larp>) => <CalendarEvent {...props} />,
        }}
        onSelectEvent={setSelected}
      />
    </Box>
  );
}

export default Calendar;
