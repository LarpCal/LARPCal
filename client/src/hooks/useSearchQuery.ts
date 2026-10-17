import { useSearchParams } from "react-router-dom";
import { LarpQuery } from "../types";
import { useMemo } from "react";
import { searchParamsToLarpQuery } from "../util/utilities";

export function useSearchQuery() {
  const [searchParams] = useSearchParams();
  const queryParams: LarpQuery = useMemo(
    () => searchParamsToLarpQuery(searchParams),
    [searchParams],
  );

  return queryParams;
}
