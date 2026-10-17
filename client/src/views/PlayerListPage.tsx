import { useQuery } from "@tanstack/react-query";
import LarpAPI from "../util/api";
import { useState } from "react";
import { Pagination, Skeleton, Stack, Typography } from "@mui/material";
import { TextLink } from "../components/ui/TextLink";

export default function PlayerListPage() {
  const [page, setPage] = useState(0);
  const { data } = useQuery({
    queryKey: ["users", "listing", { page }],
    queryFn: () => LarpAPI.getListedUsers(page),
  });

  const showPagination = data?.pages && data.pages > 1;
  const pagination = showPagination && (
    <Pagination
      sx={{ my: 2 }}
      count={data.pages}
      page={page + 1}
      onChange={(_event, page) => setPage(page - 1)}
    />
  );

  return (
    <>
      <Typography variant="h1" mb={!showPagination ? 2 : 0}>
        Players
      </Typography>

      {pagination}

      <Stack component="ul" ml={2}>
        {data?.users.map((user) => (
          <li key={user.id}>
            <TextLink to={`/players/${user.username}/larps`}>
              {user.username}
            </TextLink>
          </li>
        ))}
        {!data && (
          <>
            <li>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={200} />
            </li>
          </>
        )}
      </Stack>

      {pagination}
    </>
  );
}
