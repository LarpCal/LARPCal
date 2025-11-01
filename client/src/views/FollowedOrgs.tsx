import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useUser } from "../hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import LarpAPI from "../util/api";

export default function FollowedOrgs() {
  const { user } = useUser();

  const { mutate, isPending } = useMutation({
    mutationFn: async (orgId: number) => LarpAPI.followOrg(orgId),
    onSuccess: () => {},
  });

  return (
    <Stack spacing={2} alignContent="center" m="2rem">
      <Typography variant="h2">Followed organizations</Typography>
      <List sx={{ maxWidth: 500, width: "100%", alignSelf: "center" }}>
        {user.following?.map((org) => (
          <ListItem
            key={org.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="Stop following"
                onClick={() => mutate(org.id)}
                disabled={isPending}
              >
                <RemoveCircleIcon />
              </IconButton>
            }
          >
            <ListItemText>{org.orgName}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
