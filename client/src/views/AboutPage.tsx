import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Link as RouterLink } from "react-router-dom";

function AboutPage() {
  return (
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
              <FontAwesomeIcon icon={faCalendar} /> &nbsp;
            </Typography>
            We Are LarpCal!
          </Typography>
          <Typography variant="h4">
            The event hub for Live Action Role Playing events in Europe and
            beyond!
          </Typography>
          <Typography component="p" sx={{ marginTop: "1rem" }}>
            This LARP Calendar is a passion project made to create a one stop
            place for people looking for international LARP's, there have been
            other attempts this calendar have been privately financed so
            professional people have been able to create the best possible page.
          </Typography>
        </Box>

        <Typography component="h3" variant="h3">
          The purpose of the page is:
        </Typography>

        <Typography variant="h5" component="h5">
          <FontAwesomeIcon icon={faArrowRight} /> &nbsp; Help for players:
        </Typography>
        <Typography>
          <Box
            className="filled-light"
            sx={{
              width: "100%",
              padding: "1rem 3rem",
            }}
          >
            <List dense>
              <ListItem>Where would I find my first larp?</ListItem>
              <ListItem>What kind of games are coming out this year?</ListItem>
              <ListItem>
                Which games are registration open for right now?
              </ListItem>
              <ListItem>What happens next spring?</ListItem>
            </List>
          </Box>
        </Typography>

        <Typography variant="h5" component="h5">
          <FontAwesomeIcon icon={faArrowRight} /> &nbsp; Help for game managers:
        </Typography>
        <Box
          className="filled-light"
          sx={{
            width: "100%",
            padding: "1rem 3rem",
          }}
        >
          <Typography>
            <List dense>
              <ListItem>
                Is there already a big game coming up for the weekend I'm
                planning?
              </ListItem>
              <ListItem>Have similar games been held recently?</ListItem>
            </List>
          </Typography>
        </Box>

        <Box component="section" sx={{ padding: "6rem", textAlign: "center" }}>
          <Typography component="h2" variant="h2">
            Want to add a LARP?
          </Typography>
          <Typography>
            <Link component={RouterLink} to="/orgs/apply">
              Fill out our form
            </Link>{" "}
            and get a user when you have the user you will be able to add and
            edit your own LARPs!
          </Typography>

          <Typography>
            LARP Calendar reserves the right to remove any LARP and user at any
            time for any reason.
          </Typography>
        </Box>

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
              variant="h3"
              component="span"
              sx={{ display: "inline" }}
              color="primary"
            ></Typography>
            Make a Donation
          </Typography>
          <Typography variant="h5">
            This page have been financed by a single individual if you want to
            help out with keeping the page running and getting improvements
            click the link below!
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="https://www.paypal.com/donate/?hosted_button_id=WEP34HR7G6XPJ"
            sx={{
              margin: "2rem",
            }}
          >
            Donate Today
          </Button>
        </Box>

        <Box component="section" sx={{ padding: "6rem", textAlign: "center" }}>
          <Typography component="h2" variant="h2">
            Calendar Team
          </Typography>
          <Typography>
            Questions, comments and feedback can be sent to the maintenance of
            the calendar at{" "}
            <a href="mailto:jacob@larpcal.com">Jacob@larpcal.com</a>
          </Typography>

          <Typography>
            The calendar was funded by Jacob Møller jensen and developed by
            Stuart Fleisher
          </Typography>
        </Box>
      </Stack>
    </>
  );
}

export default AboutPage;
