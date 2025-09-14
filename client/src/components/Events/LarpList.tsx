import { Box, Grid, Typography } from "@mui/material";
import LarpCard from "../../components/Events/LarpCard";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Link, useLocation } from "react-router-dom";
import { Larp } from "../../types";

type LarpListProps = {
  larps: Larp[];
  recordsPerPage?: number;
};

function LarpList({ larps, recordsPerPage = 24 }: LarpListProps) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const q = query.get("q");

  const page = parseInt(query.get("page") || "1", 10);
  const pageStart = (page - 1) * recordsPerPage;
  const pageEnd = page * recordsPerPage;
  const pageCount = Math.ceil(larps.length / recordsPerPage);

  const pagination = (
    <Pagination
      count={pageCount}
      page={page}
      sx={{
        "& > .MuiPagination-ul": {
          justifyContent: "center",
        },
        margin: "1rem",
      }}
      renderItem={(item) => (
        <PaginationItem
          className="EventList-pagelink"
          component={Link}
          to={`${location.pathname}${`?page=${item.page}`}${q ? `&q=${q}` : ""}`}
          {...item}
        />
      )}
    />
  );

  if (larps.length === 0) {
    return (
      <Box className="EventList-empty">
        <Typography variant="body1" color="charcoal" align="center">
          No events match this search.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {pagination}
      <Grid
        container
        flexWrap={"wrap"}
        spacing={2}
        margin="auto"
        justifyContent="center"
        columnSpacing={2}
        rowSpacing={4}
        // sx={{ padding: '1rem' }}
      >
        {larps.slice(pageStart, pageEnd).map((larp) => {
          return (
            <Grid item key={larp.id} xs={12} sm={6} md={4} lg={4} xl={4}>
              <LarpCard larp={larp} />
            </Grid>
          );
        })}
      </Grid>
      {pagination}
    </>
  );
}

export default LarpList;
