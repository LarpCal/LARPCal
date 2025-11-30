import {
  faComment,
  faEnvelope,
  faGlobe,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Typography } from "@mui/material";
import { useContext } from "react";

import { Larp } from "../../types";
import { JSDateToLuxon } from "../../util/typeConverters";
import { userContext } from "../../context/userContext";
import ToastMessage from "../ui/ToastMessage";
import { BodyText } from "../ui/BodyText";
import { TextLink } from "../ui/TextLink";

import LarpActions from "./LarpActions";
import TagCard from "./TagDisplay";

import "./LarpDetails.scss";

type LarpDetailsProps = {
  larp: Larp;
};

function LarpDetails({ larp }: LarpDetailsProps) {
  const { user } = useContext(userContext);
  const { username, isAdmin } = user;

  return (
    <Box className="LarpDetails">
      {!larp.isPublished && (
        <ToastMessage
          messages={[
            "Your LARP has been saved, but your account is still pending approval.  Your LARP will be automatically published once your organizer account has been reviewed by an admin.",
          ]}
          title="Saved (but not published)"
          severity="success"
        />
      )}
      <Box
        className="banner"
        sx={{
          backgroundImage: `url(${larp.imgUrl.lg})`,
          backgroundSize: "cover",
        }}
      >
        {(larp.organization.username === username || isAdmin === true) && (
          <LarpActions
            larpId={larp.id}
            isAdmin={isAdmin}
            position="absolute"
            bottom="1rem"
            right="1rem"
          />
        )}
      </Box>

      <Stack
        className="LarpDetails-content"
        direction="column"
        spacing={2}
        alignContent="center"
      >
        <Typography
          variant="h4"
          className="filled-secondary"
          sx={{ padding: "0.5rem" }}
        >
          {JSDateToLuxon(larp.start).toLocaleString({
            weekday: "short",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          -{" "}
          {JSDateToLuxon(larp.end).toLocaleString({
            weekday: "short",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>
        <Typography component="h1" variant="h1" className="title">
          <TextLink to={`/events/${larp.id}`}>{larp.title}</TextLink>
        </Typography>

        <Stack direction="row" spacing={1}>
          {larp.tags.map((tag) => (
            <TagCard key={tag.name} tag={tag} fontSize={14} />
          ))}
        </Stack>

        <Box className="filled-light">
          <Typography>
            Hosted By:{" "}
            <TextLink to={`/orgs/${larp.organization.id}`}>
              {larp.organization.orgName}
            </TextLink>
          </Typography>
          <Typography
            // color={ticketColor}
            variant={"details2"}
          >
            Tickets: {larp.ticketStatus.replace(/_/g, " ")}
          </Typography>
        </Box>

        <section id="About">
          <Typography component="h3" variant="h2" className="Date & Time">
            About this LARP:
          </Typography>
          <BodyText text={larp.description} />
        </section>

        <section id="Location">
          <Typography component="h3" variant="h2" className="Date & Time">
            Location:
          </Typography>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className="icon-text"
            >
              <FontAwesomeIcon icon={faLocationDot} />
              <Typography>
                {larp.city}, {larp.country}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className="icon-text"
            >
              <FontAwesomeIcon icon={faComment} />
              <Typography>{larp.language}</Typography>
            </Stack>
          </Box>
        </section>

        <section id="DateAndTime">
          <Typography component="h3" variant="h2" className="Date & Time">
            Date & Time:
          </Typography>
          <Typography>
            <Box component="span" sx={{ fontWeight: 900 }}>
              Starts:{" "}
            </Box>
            {JSDateToLuxon(larp.start).toLocaleString({
              weekday: "short",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Typography>
          <Typography>
            <Box component="span" sx={{ fontWeight: 900 }}>
              Ends:{" "}
            </Box>
            {JSDateToLuxon(larp.end).toLocaleString({
              weekday: "short",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Typography>
        </section>

        <section id="Organizer">
          <Typography component="h3" variant="h2" className="organizer">
            About the organizer:
          </Typography>
          <Box
            className="filled-light"
            sx={{
              padding: "1rem 2rem",
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              // spacing={3}
              alignItems="center"
              flexWrap="wrap"
            >
              <Box
                sx={{
                  backgroundImage: `url(${larp.organization.imgUrl.lg})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderRadius: "5px",
                  overflow: "auto",
                  width: { xs: "100%", sm: "200px" },
                  height: "200px",
                }}
              />
              <Box
                sx={{
                  padding: {
                    xs: "1rem 0",
                    sm: "2rem",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  component="h6"
                  sx={{
                    marginBottom: ".5rem",
                  }}
                >
                  {larp.organization.orgName}
                </Typography>
                <Typography>
                  <FontAwesomeIcon icon={faUser} />
                  &nbsp; &nbsp;
                  <TextLink to={`/orgs/${larp.organization.id}`}>
                    View Profile
                  </TextLink>
                </Typography>
                <Typography>
                  <FontAwesomeIcon icon={faGlobe} />
                  &nbsp; &nbsp;
                  <TextLink to={`${larp.organization.orgUrl}`}>
                    {larp.organization.orgUrl}
                  </TextLink>
                </Typography>
                <Typography>
                  <FontAwesomeIcon icon={faEnvelope} />
                  &nbsp; &nbsp;
                  <TextLink to={`mailto:${larp.organization.email}`}>
                    {larp.organization.email}
                  </TextLink>
                </Typography>
              </Box>
            </Stack>
            <Typography
              sx={{
                paddingTop: "1rem",
              }}
            >
              {larp.organization.description}
            </Typography>
          </Box>
        </section>
      </Stack>
    </Box>
  );
}

export default LarpDetails;
