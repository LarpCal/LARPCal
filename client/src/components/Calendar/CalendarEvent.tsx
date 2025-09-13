import { Box, Popper, Card } from '@mui/material';
import { Larp } from '../../types';
import LarpCard from '../Events/LarpCard';
import { EventProps } from 'react-big-calendar';
import { useState, useRef } from 'react';

function CalendarEvent(props: EventProps<Larp>) {
  const { event } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const anchorEl = useRef(null);
  //USE react-popper for a non mui solution

  return (
    <Box
      onMouseOver={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      ref={anchorEl}
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      {event.title}

      <Popper
        placement="left"
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              tether: true,
            },
          },
        ]}
        open={showTooltip}
        anchorEl={anchorEl.current}
        style={{
          zIndex: 1000,
          padding: '0 .5rem',
          width: '250px',
        }}
      >
        <Card
          sx={{
            minWidth: '300px',
            // margin:'1rem'
          }}
        >
          <LarpCard larp={event} />
        </Card>
      </Popper>
    </Box>
  );
}

export default CalendarEvent;
