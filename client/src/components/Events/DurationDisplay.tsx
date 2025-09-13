import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import DateCard from './DateCard';

type DurationDisplayProps = {
  start: Date;
  end: Date;
  background?: 'light' | 'dark';
};

function DurationDisplay({
  start,
  end,
  background = 'light',
}: DurationDisplayProps) {
  const theme = useTheme();

  return (
    <Stack
      className="DurationDisplay"
      direction="row"
      alignItems="center"
      spacing={1}
    >
      <DateCard date={start} />
      <Typography
        variant="h3"
        sx={{
          color: background === 'dark' ? 'white' : theme.palette.dark.main,
        }}
      >
        -
      </Typography>
      <DateCard date={end} />
    </Stack>
  );
}

export default DurationDisplay;
