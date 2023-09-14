// @mui
import { Typography } from '@mui/material';
// components
import Image from 'src/components/image';

// ----------------------------------------------------------------------

export default function ComingSoonView() {
  return (
    <>
      <Typography variant="h3" paragraph>
        Disponível Brevemente!
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        Estamos a trabalhar para desenvolver esta página o mais breve possível.
      </Typography>

      <Image
        alt="comingsoon"
        src="/assets/illustrations/illustration_comingsoon.svg"
        sx={{
          my: 3,
          mx: 'auto',
          maxWidth: 320,
        }}
      />
    </>
  );
}
