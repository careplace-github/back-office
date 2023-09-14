import { useState } from 'react';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATHS } from 'src/routes';
import fetch from 'src/lib/fetch';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { signIn, useSession } from 'next-auth/react';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<boolean>(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Por favor insira um email válido')
      .required('Por favor insira um email'),
    password: Yup.string().required('Por favor insira uma password'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };
  const { data: user } = useSession(); // Get the user data after sign-in

  const { push } = useRouter();

  const handleForgotPassword = () => {
    const path = methods.getValues('email')
      ? `${PATHS.auth.forgotPassword}?email=${methods.getValues('email')}`
      : PATHS.auth.forgotPassword;
    push(path);
  };

  const methods = useForm({
    mode: 'onBlur',
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async data => {
    const { email, password } = data;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Disable the default redirect behavior
    });

    if (result?.ok) {
      const fetchUser = await fetch(
        '/api/auth/session',

        {
          method: 'GET',
        }
      );

      sessionStorage.setItem('name', fetchUser?.name || '');
      sessionStorage.setItem('email', fetchUser?.email || '');
      sessionStorage.setItem('profile_picture', fetchUser?.profile_picture || '');
      sessionStorage.setItem('role', fetchUser?.role || '');
      sessionStorage.setItem(
        'health_unit_logo',
        fetchUser?.health_unit?.business_profile?.logo || ''
      );
      sessionStorage.setItem(
        'health_unit_name',
        fetchUser?.health_unit?.business_profile?.name || ''
      );
      sessionStorage.setItem('permissions', fetchUser?.permissions || '');

      push(PATHS.root);
    } else {
      setLoginError(true);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {loginError && (
          <Alert sx={{ width: '100%', textAlign: 'left' }} severity="error">
            O email ou a password estão incorretos.
          </Alert>
        )}{' '}
        <RHFTextField name="email" label="Email" />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Typography
          onClick={handleForgotPassword}
          variant="body2"
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          color="text.secondary">
          Esqueceu-se da password?
        </Typography>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          bgcolor: 'primary.main',
          color: theme => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'primary.dark',
            color: theme => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}>
        Entrar
      </LoadingButton>
    </FormProvider>
  );
}
