import { Calendar as BigCalendar, luxonLocalizer } from "react-big-calendar";
import { DateTime } from "luxon";
import { EventProps } from "react-big-calendar";
import { Box, Modal } from "@mui/material";
import { useCallback, useState } from "react";

import { Larp } from "../../types";
import EventDetails from "../Events/LarpDetails";
import { useFetchLarps } from "../../hooks/useFetchLarps";
import ToastMessage from "../ui/ToastMessage";

import CalendarEvent from "./CalendarEvent";
import "./Calendar.scss";

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = luxonLocalizer(DateTime, {
  firstDayOfWeek: 1, //Start calendar on Monday
}); // or globalizeLocalizer

function Calendar() {
  const { larps, loading, error } = useFetchLarps({
    isPublished: true,
  });

  const [selected, setSelected] = useState<Larp | null>(null);
  const handleCloseDetails = useCallback(() => {
    setSelected(null);
  }, []);

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
        localizer={localizer}
        events={larps}
        views={["month", "week"]}
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
