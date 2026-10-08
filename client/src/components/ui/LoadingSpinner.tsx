import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import "./LoadingSpinner.scss";

function LoadingSpinner() {
  return (
    <Box
      className="LoadingSpinner"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
    >
      <CircularProgress size="6rem" />
    </Box>
  );
}

export default LoadingSpinner;
