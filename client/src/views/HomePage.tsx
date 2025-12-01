import Calendar from "../components/Calendar/Calendar";
import CategoryBar from "../components/Events/CategoryBar";
import { DateTime } from "luxon";

function HomePage() {
  return (
    <>
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

      <Calendar />

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
          startBefore: DateTime.now().plus({ month: 1 }).endOf("month").toISO(),
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
  );
}

export default HomePage;
