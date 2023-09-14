// react
import { useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Link, Typography } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { AuthResetPasswordForm } from '../components';

// ----------------------------------------------------------------------

export default function ResetPasswordView() {
  return (
    <>
      <Image
        alt="reset password"
        src="/assets/icons/undraw_email.svg"
        sx={{ mb: 5, width: 100, mx: 'auto' }}
      />

      <Typography variant="h3" paragraph>
        Repor Password
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Enviámos-lhe um código com 6 dígitos para o seu email.
        <br />
        Por favor escreva o código abaixo para definir a sua nova password.
      </Typography>

      <AuthResetPasswordForm />

      <Link
        component={NextLink}
        href={PATHS.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}>
        <Iconify icon="carbon:chevron-left" width={16} sx={{ mr: 1 }} />
        Voltar ao Login
      </Link>
    </>
  );
}
