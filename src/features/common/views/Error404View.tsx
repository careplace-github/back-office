import { m } from 'framer-motion';
// next
import NextLink from 'next/link';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
// assets
import { PageNotFoundIllustration } from 'src/assets/illustrations';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function Error404View() {
  return (
    <>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            404 - Página Não Encontrada
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Pedimos desculpa mas não conseguimos encontrar a página que procura. Talvez tenha
            introduzido o URL incorreto?
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Typography sx={{ color: 'text.secondary', mb: 10 }}>
          <br />
          Se achar que isto é um erro por favor contacte-nos através do email{' '}
          <a href="mailto:suporte@careplace.pt"> suporte@careplace.pt </a>
        </Typography>

        <Button component={NextLink} href={''} size="large" variant="contained">
          Home
        </Button>
      </MotionContainer>
    </>
  );
}
