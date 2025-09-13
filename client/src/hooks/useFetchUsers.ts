import { useEffect, useState } from 'react';
import { PublicUser } from '../types';
import LarpAPI from '../util/api';

type FetchUsersResult = {
  users: PublicUser[];
  setUsers: React.Dispatch<React.SetStateAction<PublicUser[]>>;
  loading: boolean;
  error: any;
};

function useFetchUsers(): FetchUsersResult {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    async function fetchLarps() {
      //TODO: add filtering
      try {
        const response = await LarpAPI.getAllUsers();
        setUsers(response);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    }

    fetchLarps();
  }, [setUsers]);

  return {
    users,
    setUsers,
    loading,
    error,
  };
}

export { useFetchUsers };
