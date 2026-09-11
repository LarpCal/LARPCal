import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";

import { useUser } from "../hooks/useUser";
import LarpList from "../components/Events/LarpList";
import { useFetchUserLarps } from "../hooks/useFetchLarps";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function MyLarpsPage() {
  const { user } = useUser();
  const { data: larps, isLoading } = useFetchUserLarps(
    user.username ?? undefined,
  );

  if (user.username === null) {
    return <Navigate to="/auth/login" />;
  }

  const header = (
    <Typography variant="h1">{user.firstName}&rsquo;s LARPs</Typography>
  );
  if (isLoading) {
    return (
      <>
        {header}
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      {header}

      <Typography variant="h2">Upcoming</Typography>

      <LarpList larps={larps?.future ?? []} />

      <Typography variant="h2">Past</Typography>

      <LarpList larps={larps?.future ?? []} />
    </>
  );
}
