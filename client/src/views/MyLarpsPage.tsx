import { Navigate } from "react-router-dom";
import { Button, Checkbox, Grid, Link, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "../hooks/useUser";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LarpAPI from "../util/api";
import { TextLink } from "../components/ui/TextLink";
import { useFetchUserLarps } from "../hooks/useFetchLarps";
import { Larp, LarpAttendanceStatus } from "../types";
import LarpCard from "../components/Events/LarpCard";
import { useMemo } from "react";

export default function MyLarpsPage() {
  const { user } = useUser();
  const { username } = user;
  const { data, isLoading, update, isUpdating } = useFetchUserLarps({
    username,
    showAll: true,
  });
  const past = useMemo(
    () =>
      data?.past?.filter(({ attendance }) => attendance === "going") ?? null,
    [data],
  );

  const { data: calendarUrl } = useQuery({
    queryKey: ["users", username, "calendar"],
    async queryFn() {
      if (!username) {
        throw new Error("Not logged in");
      }
      const { url } = await LarpAPI.getUserCalendar(username);
      return url;
    },
    enabled: !!username,
  });

  const queryClient = useQueryClient();
  const { mutate: toggleCalendar, isPending: isTogglingCalendar } = useMutation(
    {
      mutationKey: ["users", username, "calendar"],
      mutationFn() {
        if (!username) {
          throw new Error("Not logged in");
        }

        return LarpAPI.updateUserCalendar(username, !calendarUrl);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["users", username, "calendar"],
        });
      },
    },
  );

  if (username === null) {
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

  const { visibility, future } = data;

  return (
    <>
      {header}

      <Stack mb={2} p={2} gap={1} className="filled-light">
        <Typography component="h2" variant="h4">
          Visibility settings
        </Typography>

        <Typography>
          Share what LARPs you are going to{" "}
          <TextLink to={`/players/${user.username}/larps`}>here</TextLink>.
        </Typography>

        <Typography component="label" display="block">
          <Checkbox
            checked={visibility.listing}
            onChange={() =>
              update({ ...visibility, listing: !visibility.listing })
            }
            disabled={isUpdating}
            style={{ paddingBlock: 0 }}
          />
          Show in user listing
        </Typography>

        <Typography component="label" display="block">
          <Checkbox
            checked={visibility.future}
            onChange={() =>
              update({ ...visibility, future: !visibility.future })
            }
            disabled={isUpdating}
            style={{ paddingBlock: 0 }}
          />
          Show future events
        </Typography>

        <Typography component="label" display="block">
          <Checkbox
            checked={visibility.past}
            onChange={() => update({ ...visibility, past: !visibility.past })}
            disabled={isUpdating}
            style={{ paddingBlock: 0 }}
          />
          Show past events
        </Typography>

        <Typography>
          {calendarUrl ? (
            <>
              Access your private calendar feed{" "}
              <Link href={calendarUrl} target="_blank">
                here
              </Link>
              .
              <Button
                onClick={() => toggleCalendar()}
                disabled={isTogglingCalendar}
                sx={{ display: "block" }}
              >
                Disable calendar feed
              </Button>
            </>
          ) : (
            <Button
              onClick={() => toggleCalendar()}
              disabled={isTogglingCalendar}
            >
              Enable calendar feed
            </Button>
          )}
        </Typography>
      </Stack>

      <Typography variant="h2">Upcoming</Typography>

      <MyLarpList larps={future ?? []} />

      <Typography variant="h2">Past</Typography>

      <MyLarpList larps={past ?? []} />
    </>
  );
}

function MyLarpList({
  larps,
}: {
  larps: (Larp & { attendance: LarpAttendanceStatus })[];
}) {
  if (!larps.length) {
    return (
      <Typography variant="body1" color="charcoal">
        No larps
      </Typography>
    );
  }

  return (
    <Grid
      container
      flexWrap="wrap"
      spacing={2}
      columnSpacing={2}
      rowSpacing={4}
    >
      {larps.map((larp) => (
        <Grid item key={larp.id} xs={12} sm={6} md={4} lg={4} xl={4}>
          <LarpCard larp={larp} attendance={larp.attendance} />
        </Grid>
      ))}
    </Grid>
  );
}
