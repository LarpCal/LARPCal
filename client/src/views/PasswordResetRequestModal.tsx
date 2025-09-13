import { Box, Stack, Typography } from '@mui/material';
import PasswordResetRequestForm from '../components/Forms/PasswordResetRequestForm';

type props = {
  handleClose: () => void;
};

function PasswordResetRequestModal({ handleClose }: props) {
  return (
    <Stack
      justifyContent={'center'}
      sx={{
        padding: '3rem',
        backgroundColor: '#f5f2ef',
        width: '80%',
        margin: 'auto',
        borderRadius: '1rem',
      }}
    >
      <Typography component="h2" variant="h3" color="#242424">
        Reset your password
      </Typography>
      <Box
        sx={{
          // padding: '1rem',
          width: '100%',
          marginTop: '2rem',
          maxWidth: '500px',
        }}
      >
        <PasswordResetRequestForm handleClose={handleClose} />
      </Box>
    </Stack>
  );
}

export default PasswordResetRequestModal;
