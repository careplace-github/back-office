// react
import { useState, useEffect } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { Link, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';
// routes
import { PATHS } from 'src/routes';
// contexts

// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
//
import useCountdown from 'src/hooks/useCountdown';
// hooks
import { AuthVerifyCodeForm } from '../components';

// ----------------------------------------------------------------------

export default function VerifyCodeView() {
  return (
    <>
      <Image alt="email inbox" src="/assets/icons/undraw_email.svg" sx={{ mb: 5, mx: 'auto' }} />

      <Typography variant="h3">Confirmar Conta</Typography>

      <Typography variant="body2" sx={{ mt: 2, mb: 5, color: 'text.secondary' }}>
        Enviámos-lhe um código com 6 dígitos para o seu telemóvel. Por favor escreva o código abaixo
        para confirmar a sua conta.
      </Typography>

      <AuthVerifyCodeForm />

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
