import LarpAPI from "../util/api";
import { useQuery } from "@tanstack/react-query";

function useFetchOrg(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["org", id],
    queryFn: () => LarpAPI.getOrgById(id),
  });

  return { org: data, loading: isLoading, error: error ? [error.message] : [] };
}

export { useFetchOrg };
