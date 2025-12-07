import { Box, Card, Popper } from "@mui/material";
import { Larp } from "../../types";
import LarpCard from "../Events/LarpCard";
import { EventProps } from "react-big-calendar";
import { MouseEventHandler, useCallback, useRef, useState } from "react";

function CalendarEvent(props: EventProps<Larp>) {
  const { event } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const anchorEl = useRef(null);

  const handleShowTooltip: MouseEventHandler = useCallback(() => {
    setShowTooltip(true);
  }, []);
  const handleHideTooltip: MouseEventHandler = useCallback(() => {
    setShowTooltip(false);
  }, []);

  return (
    <Box
      onMouseOver={handleShowTooltip}
      onMouseLeave={handleHideTooltip}
      ref={anchorEl}
      height="100%"
      width="100%"
    >
      {event.title}

      <Popper
        placement="left"
        modifiers={[
          {
            name: "flip",
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: "document",
            },
          },
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              altAxis: true,
              tether: true,
            },
          },
        ]}
        open={showTooltip}
        anchorEl={anchorEl.current}
        sx={{
          zIndex: 1000,
          padding: "0 .5rem",
          width: "250px",
        }}
      >
        <Card
          sx={{
            minWidth: "300px",
          }}
        >
          <LarpCard larp={event} />
        </Card>
      </Popper>
    </Box>
  );
}

export default CalendarEvent;
