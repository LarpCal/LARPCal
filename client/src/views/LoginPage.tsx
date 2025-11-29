import { Box, Stack, Typography } from "@mui/material";
import LoginForm from "../components/Forms/LoginForm";
import { useUser } from "../hooks/useUser";
import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserLoginData } from "../types";

export default function LoginPage() {
  const { login } = useUser();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const redirect = params.get("redirect");
  const handleLogin = useCallback(
    async (credentials: UserLoginData) => {
      await login(credentials);
      if (redirect?.startsWith("/") && !redirect.includes("..")) {
        navigate(redirect);
      } else {
        navigate(`/users/${credentials.username}`);
      }
    },
    [login, redirect, navigate],
  );
  return (
    <Stack
      justifyContent={"center"}
      sx={{
        padding: "3rem",
      }}
    >
      <Typography component="h1" variant="h1">
        Sign in to Larp Calendar
      </Typography>
      <Box
        sx={{
          // padding: '1rem',
          width: "100%",
          marginTop: "2rem",
        }}
      >
        <LoginForm login={handleLogin} />
      </Box>
    </Stack>
  );
}
