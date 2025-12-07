import { LarpQuery } from "../types";
import LarpAPI from "../util/api";
import { base64Encode } from "../util/utilities";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Manages fetching and stores state for a Larp list.
 */
function useFetchLarps(query: LarpQuery = {}, active = false) {
  const now = useMemo(() => DateTime.now().toISO(), []);
  // Flag to query only "Active" records (published events that haven't ended)
  if (active) {
    query.isPublished = true;
    query.endAfter = query.endAfter || now;
  }

  const {
    data: larps = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["larps", query],
    queryFn: async () => {
      const queryString = base64Encode(JSON.stringify(query));
      const response = await LarpAPI.getAllLarps(queryString);
      return response;
    },
  });

  return {
    larps,
    loading: isLoading,
    error,
    refetch,
  };
}

export { useFetchLarps };
