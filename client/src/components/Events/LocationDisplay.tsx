import { Box, Stack, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faLocationDot } from "@fortawesome/free-solid-svg-icons";

import "./LocationDisplay.scss";

type LocationDisplayProps = {
  city: string;
  country: string;
  language: string;
};

function LocationDisplay({ city, country, language }: LocationDisplayProps) {
  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        className="icon-text"
      >
        <FontAwesomeIcon icon={faLocationDot} />
        <Typography variant="details2">
          {city}, {country}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        className="icon-text"
      >
        <FontAwesomeIcon icon={faComment} />
        <Typography variant="details2">{language}</Typography>
      </Stack>
    </Box>
  );
}

export default LocationDisplay;
