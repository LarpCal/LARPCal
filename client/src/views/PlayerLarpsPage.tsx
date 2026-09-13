import { Navigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { Typography } from "@mui/material";
import { useFetchUserLarps } from "../hooks/useFetchLarps";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LarpList from "../components/Events/LarpList";

export default function PlayerLarpsPage() {
  const { user } = useUser();
  const { username } = useParams<"username">();
  const { data, isLoading } = useFetchUserLarps(username);

  if (user.username === null) {
    return <Navigate to="/auth/login" />;
  }

  const header = (
    <Typography variant="h1" mb="2rem">
      {username}&rsquo;s Games
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

  const { future, past } = data;

  if (future === null && past === null) {
    return (
      <>
        {header}
        <Typography>{username} has not made their games public</Typography>
      </>
    );
  }

  return (
    <>
      {header}

      <Typography variant="h2">Upcoming</Typography>

      <LarpList larps={future ?? []} noPagination />

      <Typography variant="h2">Past</Typography>

      <LarpList larps={past ?? []} noPagination />
    </>
  );
}
