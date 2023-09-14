// react
import { useState, useEffect } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { Link, Typography, Box } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar'; //
import { AuthVerifyEmailForm } from '../components';

// ----------------------------------------------------------------------

export default function VerifyEmailView() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Image
        alt="reset password"
        src="/assets/icons/undraw_email.svg"
        sx={{ mb: 5, width: 100, mx: 'auto' }}
      />

      <Typography variant="h3" paragraph>
        Verificar Email
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Enviámos-lhe um código com 6 dígitos para o seu email.
        <br />
        Por favor escreva o código em baixo para verificar o seu endereço de email.
      </Typography>

      <AuthVerifyEmailForm />
    </>
  );
}
