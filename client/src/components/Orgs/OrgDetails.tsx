import { Organization } from "../../types";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CategoryBar from "../Events/CategoryBar";
import "./OrgDetails.scss";
import { useContext } from "react";
import { userContext } from "../../context/userContext";
import { DateTime } from "luxon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LarpAPI from "../../util/api";
import { faImage, faPencil } from "@fortawesome/free-solid-svg-icons";
import TooltipButton from "../FormComponents/TooltipButton";

type OrgDetailsProps = {
  org: Organization;
};

function OrgDetails({ org }: OrgDetailsProps) {
  const { user } = useContext(userContext);
  const { username, isAdmin } = user;

  const queryClient = useQueryClient();
  const { mutate: followMutate } = useMutation({
    mutationFn: () => LarpAPI.followOrg(org.id),
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["org", org.id] });
    },
  });

  return (
    <Box className="OrgDetails">
      <Box
        className="banner"
        sx={{
          backgroundImage: `url(${org.imgUrl.lg})`,
          backgroundSize: "cover",
        }}
      >
        {(org.username === username || isAdmin === true) && (
          <Stack direction="row" className="organizerControls">
            <RouterLink to={`/orgs/${org.id}/edit`}>
              <TooltipButton
                title="Edit organization details"
                icon={faPencil}
              />
            </RouterLink>
            <RouterLink to={`/orgs/${org.id}/image`}>
              <TooltipButton title="Update Banner Image" icon={faImage} />
            </RouterLink>
          </Stack>
        )}
      </Box>
      <Stack
        className="OrgDetails-content"
        direction="column"
        spacing={2}
        alignContent="center"
      >
        <Typography component="h1" variant="h1" className="title">
          <Link component={RouterLink} to={`/orgs/${org.id}`}>
            {org.orgName}
          </Link>
          <Button
            variant="outlined"
            sx={{ ml: "1rem" }}
            onClick={() => followMutate()}
          >
            {org.isFollowedByUser ? "Unfollow" : "Follow"}
            {org.followerCount > 0 && ` (${org.followerCount})`}
          </Button>
        </Typography>

        <section id="About">
          <Typography component="h3" variant="h2" className="Date & Time">
            About this Organizer:
          </Typography>
          <Typography>
            <Link component={RouterLink} to={org.orgUrl}>
              {org.orgUrl}
            </Link>
          </Typography>
          <Typography>{org.description}</Typography>
        </section>

        <CategoryBar
          title={`${org.orgName}'s Upcoming LARPs`}
          filterSet={{
            orgId: org.id,
            endAfter: DateTime.now().toISO(),
          }}
        />
        <CategoryBar
          title={`${org.orgName}'s Past LARPs`}
          filterSet={{
            orgId: org.id,
            endBefore: DateTime.now().toISO(),
          }}
        />
      </Stack>
    </Box>
  );
}

export default OrgDetails;
