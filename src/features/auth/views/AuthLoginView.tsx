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
          <Typography variant="h4">Login</Typography>
        </Stack>
      )}

      <Alert
        severity="info"
        sx={{
          mb: 3,
          // on hover change the pointer to a hand
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        onClick={() => router.push(PATHS.demo)}>
        <strong>Gostaria de se registar? </strong>
        <br></br>
        <Tooltip title="Registar">
          <Box component="span" sx={{}}>
            Clique aqui para obter uma demonstração da Plataforma #1 de gestão de operações de
            Empresas SAD, Lares e Residências Sénior em Portugal.
          </Box>
        </Tooltip>
      </Alert>

      <AuthLoginForm />
    </>
  );
}
