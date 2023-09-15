import { m } from 'framer-motion';
// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Button, Typography } from '@mui/material';
// layouts
import CompactLayout from 'src/layouts/compact';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
// assets
import { ForbiddenIllustration } from 'src/assets/illustrations';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function Error403View() {
  return (
    <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            403 - Sem Permissão
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Não tem permisão para aceder a esta página. Se necessitar de acesso peça ao
            administrador da sua empresa para lhe atribuir as permissões necessárias.
            <br />
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Typography sx={{ color: 'text.secondary', mb: 10 }}>
          <br />
          Se achar que isto é um erro por favor contacte-nos através do email{' '}
          <a href="mailto:suporte@careplace.pt"> suporte@careplace.pt </a>
        </Typography>

        <Button component={NextLink} href="" size="large" variant="contained">
          Home
        </Button>
      </MotionContainer>
  );
}
