import {
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useUser } from "../hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import LarpAPI from "../util/api";
import { useCallback } from "react";
import { TextLink } from "../components/ui/TextLink";
import { Navigate } from "react-router-dom";

export default function FollowedOrgs() {
  const { user, refetch } = useUser();

  if (!user.following) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Stack spacing={2} alignContent="center" m="2rem">
      <Typography variant="h2">Followed organizations</Typography>
      <List sx={{ maxWidth: 500, width: "100%", alignSelf: "center" }}>
        <ListItem secondaryAction={<LARPCalNewsActions />}>
          LarpCAL News
        </ListItem>
        {user.following.map((org) => (
          <ListItem
            key={org.id}
            secondaryAction={
              <FollowedOrgActions
                orgId={org.id}
                subscribed={org.email}
                onChange={refetch}
              />
            }
          >
            <ListItemText>
              <TextLink to={`/orgs/${org.id}`}>{org.orgName}</TextLink>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

interface FollowedOrgActionsProps {
  orgId: number;
  subscribed: boolean;
  onChange: () => Promise<void>;
}

function FollowedOrgActions({
  orgId,
  subscribed,
  onChange,
}: FollowedOrgActionsProps) {
  const { mutate: subscribeToggle, isPending: isSubscribePending } =
    useMutation({
      mutationFn: async () => LarpAPI.followOrg(orgId, !subscribed),
      onSuccess: async () => {
        await onChange();
      },
    });
  const { mutate: unfollow, isPending: isUnfollowPending } = useMutation({
    mutationFn: async () => LarpAPI.unfollowOrg(orgId),
    onSuccess: async () => {
      await onChange();
    },
  });
  const handleSubscribeToggle = useCallback(() => {
    subscribeToggle();
  }, [subscribeToggle]);
  const handleUnfollow = useCallback(() => {
    unfollow();
  }, [unfollow]);

  const disabled = isSubscribePending || isUnfollowPending;

  return (
    <ButtonGroup>
      <Button disabled={disabled} onClick={handleSubscribeToggle}>
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </Button>
      <Button disabled={disabled} onClick={handleUnfollow} color="error">
        Unfollow
      </Button>
    </ButtonGroup>
  );
}

function LARPCalNewsActions() {
  const { user, update, refetch } = useUser();
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      update({ email: user.email ?? "", subscribed: !user.subscribed }),
    onSuccess: refetch,
  });
  const handleSubscriptionToggle = useCallback(() => {
    mutate();
  }, [mutate]);
  return (
    <Button
      variant="outlined"
      onClick={handleSubscriptionToggle}
      disabled={isPending}
    >
      {user.subscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
}
