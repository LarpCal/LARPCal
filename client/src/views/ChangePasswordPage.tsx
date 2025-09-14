import { Box, Stack, Typography } from "@mui/material";
import { UserForCreate } from "../types";
import UserRegistrationForm from "../components/Forms/RegisterForm";

type ChangePasswordPageProps = {
  register: (userInfo: UserForCreate) => Promise<void>;
};

function ChangePasswordPage({ register }: ChangePasswordPageProps) {
  return (
    <Stack
      justifyContent={"center"}
      sx={{
        padding: "3rem",
      }}
    >
      <Typography component="h1" variant="h1">
        Create your
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

export default ChangePasswordPage;
