import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

// import "./ErrorDisplay.scss";

type props = {
  message: string;
};

function ErrorDisplay({ message }: props) {
  return (
    <Slide direction="up" in>
      <Box>
        <Alert severity="error">{message}</Alert>
      </Box>
    </Slide>
  );
}

export default ErrorDisplay;
