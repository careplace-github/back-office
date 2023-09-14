// next
import NextLink from 'next/link';
// @mui
import { Link, Typography, Container, Stack } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
// hooks
import PhoneVerifyCodeForm from '../components/PhoneVerifyCodeForm';

// ----------------------------------------------------------------------

const VerifyPhoneView = () => {
  return (
    <Container component="main">
      <Stack
        sx={{
          py: 9,
          m: 'auto',
          maxWidth: 480,
          minHeight: '90vh',
          textAlign: 'center',
          justifyContent: 'center',
        }}>
        <Image
          alt="email inbox"
          src="/assets/icons/undraw_mobile_phone.svg"
          sx={{ mb: 5, mx: 'auto' }}
        />

        <Typography variant="h3">Confirmar Telemóvel</Typography>

        <Typography variant="body2" sx={{ mt: 2, mb: 5, color: 'text.secondary' }}>
          Enviámos-lhe um código com 6 dígitos para o seu telemóvel. Por favor escreva o código
          abaixo para confirmar o número associado.
        </Typography>

        <PhoneVerifyCodeForm />
      </Stack>
    </Container>
  );
};

export default VerifyPhoneView;
