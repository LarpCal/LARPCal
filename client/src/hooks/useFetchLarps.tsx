import { LarpQuery } from "../types";
import LarpAPI from "../util/api";
import { base64Encode } from "../util/utilities";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";

/**
 * Manages fetching and stores state for a Larp[]
 *
 * @props query: a LarpQuery stringified and encoded to Base64
 */
function useFetchLarps(query: LarpQuery = {}, active: boolean = false) {
  // Flag to query only "Active" records (published events that haven't ended)
  if (active) {
    query.isPublished = true;
    query.endAfter = query.endAfter || DateTime.now().toISO();
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
