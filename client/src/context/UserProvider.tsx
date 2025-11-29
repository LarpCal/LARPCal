import { PropsWithChildren, useCallback, useState } from "react";
import { UserForCreate, UserLoginData, UserForUpdate } from "../types";
import { ANON_USER, userContext } from "./userContext";
import LarpAPI from "../util/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function UserProvider({ children }: PropsWithChildren) {
  const [username, setUsername] = useState(() => loadUsername());

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      if (!username) {
        return null;
      }
      const userData = await LarpAPI.getUser(username);
      return userData;
    },
    enabled: !!username,
  });

  const queryClient = useQueryClient();
  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["user", username] });
  }, [username]);

  /** Calls the api with login credentials and tries to log the user in
   * If successful, updates the token and the user states.
   * credentials: {username, password}
   */
  const login = useCallback(async (credentials: UserLoginData) => {
    const token = await LarpAPI.userLogin(credentials);
    localStorage.setItem("token", token);
    setUsername(LarpAPI.getUsernameFromToken(token));
  }, []);

  const logout = useCallback(() => {
    LarpAPI.userLogout();
    localStorage.removeItem("token");
    setUsername(null);
  }, []);

  const register = useCallback(async (userInfo: UserForCreate) => {
    const token = await LarpAPI.userSignup(userInfo);
    localStorage.setItem("token", token);
    setUsername(LarpAPI.getUsernameFromToken(token));
  }, []);

  const { mutateAsync: update, isPending } = useMutation({
    mutationFn(userInfo: UserForUpdate) {
      if (!username) {
        throw new Error("Not logged in");
      }
      return LarpAPI.updateUser(userInfo, username);
    },
    async onSuccess() {
      await refetch();
    },
  });

  return (
    <userContext.Provider
      value={{
        user: data ?? ANON_USER,
        login,
        logout,
        register,
        loading: isLoading || isPending,
        update,
        refetch,
        error: isError ? ["There was a problem loading user data"] : null,
      }}
    >
      {children}
    </userContext.Provider>
  );
}

function loadUsername() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  try {
    return LarpAPI.getUsernameFromToken(token);
  } catch {
    return null;
  }
}
