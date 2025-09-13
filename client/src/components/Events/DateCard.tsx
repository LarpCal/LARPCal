import { DateTime } from 'luxon';
import { Typography, Box } from '@mui/material';
import './DateCard.scss';

type DateCardProps = {
  date: Date;
};

export default function DateCard({ date }: DateCardProps) {
  const localDate = DateTime.fromJSDate(date);

  return (
    <Box className="DateCard">
      <Typography className="month">
        {localDate.toLocal().monthShort}
      </Typography>
      <Typography className="day">{localDate.toLocal().day}</Typography>
    </Box>
  );
}
