import { Box, Stack, Typography } from '@mui/material';
import { UserForCreate } from '../types';
import UserRegistrationForm from '../components/Forms/RegisterForm';

type RegisterPageProps = {
  register: (userInfo: UserForCreate) => Promise<void>;
};

function RegisterPage({ register }: RegisterPageProps) {
  return (
    <Stack
      justifyContent={'center'}
      sx={{
        padding: '3rem',
      }}
    >
      <Typography component="h1" variant="h1">
        Create your account
      </Typography>
      <Box
        sx={{
          // padding: '1rem',
          width: '100%',
          marginTop: '2rem',
        }}
      >
        <UserRegistrationForm register={register} />
      </Box>
    </Stack>
  );
}

export default RegisterPage;
