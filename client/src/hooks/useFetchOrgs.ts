import { useEffect, useState } from 'react';
import { Organization } from '../types';
import LarpAPI from '../util/api';

type FetchOrgsResult = {
  orgs: Organization[];
  setOrgs: React.Dispatch<React.SetStateAction<Organization[]>>;
  loading: boolean;
  error: any;
};

function useFetchOrgs(): FetchOrgsResult {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    async function fetchLarps() {
      //TODO: add filtering
      try {
        const response = await LarpAPI.getAllOrgs();
        setOrgs(response);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    }

    fetchLarps();
  }, [setOrgs]);

  return {
    orgs,
    setOrgs,
    loading,
    error,
  };
}

export { useFetchOrgs };
