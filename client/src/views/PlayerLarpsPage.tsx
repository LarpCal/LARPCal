import { Navigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { Typography } from "@mui/material";
import { useFetchUserLarps } from "../hooks/useFetchLarps";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LarpList from "../components/Events/LarpList";
import { TextLink } from "../components/ui/TextLink";

export default function PlayerLarpsPage() {
  const { user } = useUser();
  const { username } = useParams<"username">();
  const { data, isLoading } = useFetchUserLarps({ username });

  if (user.username === null) {
    return <Navigate to="/auth/login" />;
  }

  const header = <Typography variant="h1">{username}&rsquo;s Games</Typography>;

  if (isLoading || !data) {
    return (
      <>
        {header}

        <LoadingSpinner />
      </>
    );
  }

  const { visibility, future, past } = data;

  if (!visibility.future && !visibility.past) {
    return (
      <>
        {header}
        <Typography>{username} has not made their games public</Typography>

        {username === user.username && (
          <Typography mt={2}>
            <TextLink to="/my-larps">Edit your settings here</TextLink>
          </Typography>
        )}
      </>
    );
  }

  return (
    <>
      {header}

      {username === user.username && (
        <Typography mt={2}>
          <TextLink to="/my-larps">Edit your settings here</TextLink>
        </Typography>
      )}

      <Typography variant="h2">Upcoming</Typography>

      <LarpList larps={visibility.future ? (future ?? []) : []} noPagination />

      <Typography variant="h2">Past</Typography>

      <LarpList larps={visibility.past ? (past ?? []) : []} noPagination />
    </>
  );
}
