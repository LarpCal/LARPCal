import { Box, Stack, Typography } from "@mui/material";
import LarpCard from "./LarpCard";
import "./CategoryBar.scss";
import { useFetchLarps } from "../../hooks/useFetchLarps";
import LoadingSpinner from "../ui/LoadingSpinner";
import { LarpQuery } from "../../types";
import { base64Encode } from "../../util/utilities";

type CategoryBarProps = {
  title: string;
  filterSet: LarpQuery;
  // filterObject: any;
};

function CategoryBar({ title, filterSet }: CategoryBarProps) {
  const query = base64Encode(JSON.stringify(filterSet));
  const { larps, loading, error } = useFetchLarps(query);

  if (error.length) {
    console.warn("Error loading larps from", title);
  }

  //don't render empty lists
  if (larps.length === 0) {
    return null;
  }

  return (
    <Box className="CategoryBar">
      <Typography variant="h2">{title}</Typography>

      <Stack className="CategoryBar-itemContainer" direction="row" spacing={1}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          larps.map((larp) => <LarpCard larp={larp} key={larp.id} />)
        )}
      </Stack>
    </Box>
  );
}

export default CategoryBar;
