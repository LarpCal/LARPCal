import { Navigate } from "react-router-dom";
import { Checkbox, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUser } from "../hooks/useUser";
import LarpList from "../components/Events/LarpList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LarpAPI from "../util/api";
import { UserLarpVisibility } from "../types";
import { TextLink } from "../components/ui/TextLink";
import { useFetchUserLarps } from "../hooks/useFetchLarps";

export default function MyLarpsPage() {
  const { user } = useUser();
  const { data, isLoading } = useFetchUserLarps({
    username: user.username,
    showAll: true,
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["user", user.username, "larp"],
    mutationFn(args: UserLarpVisibility) {
      if (!user.username) {
        throw new Error("Not logged in");
      }
      return LarpAPI.updateUserLarpVisibility(args, user.username);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["users", user.username, "larps", { showAll: true }],
      });
    },
  });

  if (user.username === null) {
    return <Navigate to="/auth/login" />;
  }

  const header = (
    <Typography variant="h1" mb="2rem">
      My LARPs
    </Typography>
  );

  if (isLoading || !data) {
    return (
      <>
        {header}
        <LoadingSpinner />
      </>
    );
  }

  const { visibility, future, past } = data;

  return (
    <>
      {header}

      <Stack mb={2} p={2} gap={1} className="filled-light">
        <Typography component="h2" variant="h4">
          My visibility settings
        </Typography>

        <Typography>
          Share what LARPs you are going to{" "}
          <TextLink to={`/players/${user.username}/larps`}>here</TextLink>.
        </Typography>

        <Typography component="label" display="block">
          <Checkbox
            checked={visibility.future}
            onChange={() =>
              mutate({ past: visibility.past, future: !visibility.future })
            }
            disabled={isPending}
            style={{ paddingBlock: 0 }}
          />
          Show future events
        </Typography>

        <Typography component="label" display="block">
          <Checkbox
            checked={visibility.past}
            onChange={() =>
              mutate({ past: !visibility.past, future: visibility.future })
            }
            disabled={isPending}
            style={{ paddingBlock: 0 }}
          />
          Show past events
        </Typography>
      </Stack>

      <Typography variant="h2">Upcoming</Typography>

      <LarpList larps={future ?? []} noPagination />

      <Typography variant="h2">Past</Typography>

      <LarpList larps={past ?? []} noPagination />
    </>
  );
}
