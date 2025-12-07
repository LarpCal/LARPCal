import { Organization } from "../../types";
import { Box, Button, Stack, Typography } from "@mui/material";
import CategoryBar from "../Events/CategoryBar";
import "./OrgDetails.scss";
import { DateTime } from "luxon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LarpAPI from "../../util/api";
import {
  faImage,
  faPencil,
  faBullhorn,
} from "@fortawesome/free-solid-svg-icons";
import { LinkIconButton } from "../FormComponents/LinkIconButton";
import { useUser } from "../../hooks/useUser";
import { TextLink } from "../ui/TextLink";

type OrgDetailsProps = {
  org: Organization;
};

function OrgDetails({ org }: OrgDetailsProps) {
  const { user, refetch } = useUser();
  const { username, isAdmin } = user;

  const queryClient = useQueryClient();
  const { mutate: followMutate } = useMutation({
    async mutationFn() {
      if (org.isFollowedByUser) {
        await LarpAPI.unfollowOrg(org.id);
      } else {
        await LarpAPI.followOrg(org.id);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["org", org.id] });
      await refetch();
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
            <LinkIconButton
              title="Manage Newsletters"
              to={`/orgs/${org.id}/newsletters`}
              icon={faBullhorn}
            />
            <LinkIconButton
              title="Edit details"
              to={`/orgs/${org.id}/edit`}
              icon={faPencil}
            />
            <LinkIconButton
              title="Update image"
              to={`/orgs/${org.id}/image`}
              icon={faImage}
            />
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
          <TextLink to={`/orgs/${org.id}`}>{org.orgName}</TextLink>
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
            <TextLink to={org.orgUrl}>{org.orgUrl}</TextLink>
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
