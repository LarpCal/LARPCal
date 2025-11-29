import { Box, Stack, Typography } from "@mui/material";
import LoginForm from "../components/Forms/LoginForm";
import { useUser } from "../hooks/useUser";

export default function LoginPage() {
  const { login } = useUser();
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
        <LoginForm login={login} />
      </Box>
    </Stack>
  );
}
