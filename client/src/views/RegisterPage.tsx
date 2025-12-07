import { Box, Stack, Typography } from "@mui/material";
import UserRegistrationForm from "../components/Forms/RegisterForm";
import { useUser } from "../hooks/useUser";

export default function RegisterPage() {
  const { register } = useUser();
  return (
    <Stack
      justifyContent={"center"}
      sx={{
        padding: "3rem",
      }}
    >
      <Typography component="h1" variant="h1">
        Create your account
      </Typography>
      <Box
        sx={{
          // padding: '1rem',
          width: "100%",
          marginTop: "2rem",
        }}
      >
        <UserRegistrationForm register={register} />
      </Box>
    </Stack>
  );
}
