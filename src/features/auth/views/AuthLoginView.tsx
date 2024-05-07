// @mui
import { Alert, Tooltip, Stack, Typography, Box } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
import { useRouter } from 'next/router';
//
import { useResponsive } from 'src/hooks';
import axios from 'src/lib/axios';
import { AuthLoginForm } from '../components';

// ----------------------------------------------------------------------

export default function LoginView() {
  const isMdUp = useResponsive('up', 'md');
  const router = useRouter();
  return (
    <>
      {isMdUp && (
        <Stack spacing={2} sx={{ mb: 5, mt: 0, position: 'relative' }}>
          <Typography variant="h4">Admin Login</Typography>
        </Stack>
      )}

      <AuthLoginForm />
    </>
  );
}
