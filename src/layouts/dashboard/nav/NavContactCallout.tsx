// @mui
import { Stack, Button, Typography, Box } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
import { useSession } from 'next-auth/react';

// ----------------------------------------------------------------------

export default function NavContactCallout() {
  const { data: user } = useSession();

  return (
    <Stack
      spacing={3}
      sx={{
        px: 5,
        pb: 5,
        // Top padding
        mt: 15,
        width: 1,
        display: 'block',
        textAlign: 'center',
      }}>
      <Box component="img" src="" />

      <div>
        <Typography gutterBottom variant="subtitle1">
          Olá, {user?.name}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          Precisa de ajuda?
        </Typography>
      </div>

      <Button href={PATHS.support} target="_blank" variant="contained">
        Contacte-nos
      </Button>
    </Stack>
  );
}
