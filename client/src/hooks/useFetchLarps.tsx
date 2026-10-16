import { LarpQuery, UserLarpVisibility } from "../types";
import LarpAPI from "../util/api";
import { base64Encode } from "../util/utilities";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Manages fetching and stores state for a Larp list.
 */
export function useFetchLarps(query: LarpQuery = {}, active = false) {
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

export function useFetchUserLarps({
  username,
  showAll = false,
}: { username?: string | null; showAll?: boolean } = {}) {
  const { data, isLoading } = useQuery({
    queryKey: ["users", username, "larps", { showAll }],
    queryFn() {
      if (!username) {
        throw new Error("No username provided");
      }

      return LarpAPI.getUserLarps(username, showAll);
    },
    enabled: !!username,
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["users", username, "larp"],
    mutationFn(args: UserLarpVisibility) {
      if (!username) {
        throw new Error("Not logged in");
      }
      return LarpAPI.updateUserLarpVisibility(args, username);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["users", username, "larps", { showAll }],
      });
    },
  });

  return { isLoading, data, isUpdating: isPending, update: mutate };
}
