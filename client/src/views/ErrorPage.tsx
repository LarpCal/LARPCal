import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function ErrorPage() {
  return (
    <>
      <Typography variant="h1" align="center" mb="1rem">
        Not found
      </Typography>
      <Box maxWidth="40%" mx="auto">
        <Typography>
          The page your were looking for was either never here, or is currently
          in the woods playing a goblin with no phone signal.
        </Typography>
      </Box>
      <Box mt="1rem" mx="auto">
        <Button component={Link} to="/">
          Go home
        </Button>
      </Box>
    </>
  );
}
