// next
import NextLink from 'next/link';
// @mui
import { Link, Typography } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
//
import { AuthForgotPasswordForm } from '../components';

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  return (
    <>
      <Image
        alt="reset password"
        src="/assets/icons/undraw_forgot_password_re.svg"
        sx={{ mb: 5, width: 300, mx: 'auto' }}
      />

      <Typography variant="h3" paragraph>
        Esqueceu-se da Password?
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
        Por favor insira o endereço de email associado à sua conta e enviaremos um código de
        verificação para repor a sua password.
      </Typography>

      <AuthForgotPasswordForm />

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
