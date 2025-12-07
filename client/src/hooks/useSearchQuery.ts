import { useSearchParams } from "react-router-dom";
import { LarpQuery } from "../types";
import { useMemo } from "react";

export function useSearchQuery() {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get("q");
  const queryParams: LarpQuery = useMemo(() => {
    if (!rawQuery) {
      return {};
    }
    const decodedQuery = atob(rawQuery);
    return JSON.parse(decodedQuery);
  }, [rawQuery]);

  return queryParams;
}
