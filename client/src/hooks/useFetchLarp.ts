import { useEffect, useState } from "react";
import { Larp } from "../types";
import LarpAPI from "../util/api";

type FetchLarpsResult = {
  larp: Larp | null;
  setLarp: React.Dispatch<React.SetStateAction<Larp | null>>;
  loading: boolean;
  error: unknown;
};

function useFetchLarp(id: number): FetchLarpsResult {
  const [larp, setLarp] = useState<Larp | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    async function fetchLarp() {
      try {
        const response = await LarpAPI.getLarpById(id);
        setLarp(response);
        setLoading(false);
      } catch (err: unknown) {
        if (Array.isArray(err)) {
          setError(err);
        }
        setLoading(false);
      }
    }

    fetchLarp();
  }, [setLarp, id]);

  return { larp, setLarp, loading, error };
}

export { useFetchLarp };
