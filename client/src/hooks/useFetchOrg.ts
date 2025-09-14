import { useEffect, useState } from "react";
import { Organization } from "../types";
import LarpAPI from "../util/api";

type FetchOrgResult = {
  org: Organization | null;
  setOrg: React.Dispatch<React.SetStateAction<Organization | null>>;
  loading: boolean;
  error: any;
};

function useFetchOrg(id: number): FetchOrgResult {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const response = await LarpAPI.getOrgById(id);
        setOrg(response);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    }

    fetchOrg();
  }, [setOrg, id]);

  return { org, setOrg, loading, error };
}

export { useFetchOrg };
