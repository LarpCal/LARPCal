import { useEffect, useState } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Box, Button, List, ListItem, Stack, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link as RouterLink } from "react-router-dom";
import { UserLoginData } from "../types";

type DemoHomeProps = {
  login: (credentials: UserLoginData) => Promise<void>;
};

function DemoHome({ login }: DemoHomeProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loginDemoUser() {
      console.log("logging in");
      login({ username: "testUser", password: "password" });
      setLoading(false);
    }
    loginDemoUser();
  }, []);

  return (
    <>
      {loading ? (
        <>
          <Typography variant="h3"> Logging you in </Typography>
          <LoadingSpinner />
        </>
      ) : (
        <>
          <Stack direction="column" spacing={2} alignContent="center" m="2rem">
            <Box
              className="filled-light"
              sx={{
                width: "100%",
                textAlign: "center",
                padding: "3rem",
              }}
            >
              <Typography component="h1" variant="h1" className="title">
                <Typography
                  variant="h1"
                  component="span"
                  sx={{ display: "inline" }}
                  color="primary"
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> &nbsp;
                </Typography>
                Welcome to the LarpCal Demo!
              </Typography>
              <Typography variant="h4">
                You have been logged in as a Demo User with admin privileges.
              </Typography>
            </Box>

            <Typography variant="h5">
              This site is still under construction. Here are some of the
              features you can expect to see in Phase II:
            </Typography>
            <List dense>
              <ListItem>
                <FontAwesomeIcon icon={faCheck} /> &nbsp; Fulltext search for
                events
              </ListItem>
              <ListItem>
                <FontAwesomeIcon icon={faCheck} /> &nbsp; Event List page will
                be filterable by date, location, tags and more
              </ListItem>
              <ListItem>
                <FontAwesomeIcon icon={faCheck} /> &nbsp;
                {`Category displays (featured, this month etc) will display only the relevant events`}
              </ListItem>
              <ListItem>
                <FontAwesomeIcon icon={faArrowRight} /> &nbsp; Connection to
                donation site
              </ListItem>
              <ListItem>
                <FontAwesomeIcon icon={faArrowRight} /> &nbsp; Full page build
                for 'About'
              </ListItem>
              <ListItem>
                <FontAwesomeIcon icon={faArrowRight} /> &nbsp; Ongoing bugfixes
              </ListItem>
            </List>

            <Button variant="contained" component={RouterLink} to="/">
              Go to Home Page
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}

export default DemoHome;
