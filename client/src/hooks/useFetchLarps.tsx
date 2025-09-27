import React, { useEffect, useState } from "react";
import { Larp, LarpQuery } from "../types";
import LarpAPI from "../util/api";
import { base64Decode, base64Encode } from "../util/utilities";
import { DateTime } from "luxon";

type FetchLarpsResult = {
  larps: Larp[];
  setLarps: React.Dispatch<React.SetStateAction<Larp[]>>;
  loading: boolean;
  error: string[];
};

/**
 * Manages fetching and stores state for a Larp[]
 *
 * @props query: a LarpQuery stringified and encoded to Base64
 */
function useFetchLarps(
  queryString: string | null,
  active: boolean = false,
): FetchLarpsResult {
  const [larps, setLarps] = useState<Larp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string[]>([]);

  // Flag to query only "Active" records (published events that haven't ended)
  if (active) {
    let queryObject: LarpQuery;
    if (queryString) {
      queryObject = JSON.parse(base64Decode(queryString));
      queryObject.isPublished = true;
      queryObject.endAfter = queryObject.endAfter || DateTime.now().toISO();
    } else {
      queryObject = {
        isPublished: true,
        endAfter: DateTime.now().toISO(),
      };
    }
    queryString = base64Encode(JSON.stringify(queryObject));
  }

  useEffect(() => {
    async function fetchLarps() {
      try {
        const response = await LarpAPI.getAllLarps(queryString);
        setLarps(response);
        setLoading(false);
      } catch (err: unknown) {
        if (Array.isArray(err)) {
          setError(err);
        }
        setLoading(false);
      }
    }

    fetchLarps();
  }, [setLarps, queryString]);

  return {
    larps,
    setLarps,
    loading,
    error,
  };
}

export { useFetchLarps };
