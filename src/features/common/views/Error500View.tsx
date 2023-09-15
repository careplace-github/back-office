import { m } from 'framer-motion';
// next
import NextLink from 'next/link';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
// assets
import { SeverErrorIllustration } from 'src/assets/illustrations';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function Error500View() {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" paragraph>
          500 - Erro de Servidor
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          Ocorreu um erro inesperado. Por favor tente novamente mais tarde.
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
      </m.div>

      <Typography sx={{ color: 'text.secondary', mb: 10 }}>
        <br />
        Se precisar de ajuda por favor contacte-nos através do email{' '}
        <a href="mailto:suporte@careplace.pt"> suporte@careplace.pt </a>
      </Typography>

      <Button component={NextLink} href="" size="large" variant="contained">
        Home
      </Button>
    </MotionContainer>
  );
}
