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
import { AuthVerifyPhoneForm } from '../components';

// ----------------------------------------------------------------------

export default function VerifyPhoneView() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Image
        alt="reset password"
        src="/assets/icons/undraw_mobile_phone.svg"
        sx={{ mb: 5, height: 125, mx: 'auto' }}
      />

      <Typography variant="h3" paragraph>
        Verificar Telemóvel
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Enviámos-lhe um código com 6 dígitos para o seu telemóvel.
        <br />
        Por favor escreva o código em baixo para verificar o seu número de telemóvel.
      </Typography>

      <AuthVerifyPhoneForm />
    </>
  );
}
