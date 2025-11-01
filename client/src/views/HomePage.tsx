import Calendar from "../components/Calendar/Calendar";
import CategoryBar from "../components/Events/CategoryBar";
import { useFetchLarps } from "../hooks/useFetchLarps";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ToastMessage from "../components/ui/ToastMessage";
import { DateTime } from "luxon";
import { publishedLarpQuery } from "../util/filterPresets";
// import Carousel from "../components/ui/Carousel";
// import { Typography, Box, Stack } from "@mui/material";

function HomePage() {
  const { larps, loading, error } = useFetchLarps(publishedLarpQuery);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ToastMessage
            title="Sorry, there was a problem fetching records for this page"
            messages={error?.message}
          />
          <CategoryBar
            title="Featured LARPs"
            filterSet={{
              endAfter: DateTime.now().toISO(),
              isFeatured: true,
              isPublished: true,
            }}
          />

          <CategoryBar
            title="Available Now"
            filterSet={{
              endAfter: DateTime.now().toISO(),
              ticketStatus: ["AVAILABLE", "LIMITED"],
              isPublished: true,
            }}
          />

          <Calendar larps={larps} />

          <CategoryBar
            title="Recently Added"
            filterSet={{
              createdAfter: DateTime.now().minus({ weeks: 1 }).toISO(),
              endAfter: DateTime.now().toISO(),
              isPublished: true,
            }}
          />
          <CategoryBar
            title="LARPs this Month"
            filterSet={{
              endAfter: DateTime.now().toISO(),
              startBefore: DateTime.now().endOf("month").toISO(),
              isPublished: true,
            }}
          />
          <CategoryBar
            title="LARPs next Month"
            filterSet={{
              startAfter: DateTime.now()
                .plus({ month: 1 })
                .startOf("month")
                .toISO(),
              startBefore: DateTime.now()
                .plus({ month: 1 })
                .endOf("month")
                .toISO(),
              isPublished: true,
            }}
          />
          <CategoryBar
            title="Family friendly LARPs"
            filterSet={{
              endAfter: DateTime.now().toISO(),
              tags: "family friendly",
              isPublished: true,
            }}
          />
        </>
      )}
    </>
  );
}

export default HomePage;
