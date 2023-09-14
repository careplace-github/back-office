import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { Alert } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// lib
import fetch from 'src/lib/fetch';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
};

export default function AuthResetPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(router.query.email as string);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const theme = useTheme();
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('O email é obrigatório.').email('O email inserido é inválido.'),
  });

  const defaultValues = {
    email,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setValue, getValues } = methods;
  const { pathname, push } = useRouter();
  const onSubmit = async (data: FormValuesProps) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          email: methods.getValues('email'),
        }), // Convert data to JSON format
      });

      const path = methods.getValues('email')
        ? `${PATHS.auth.resetPassword}?email=${methods.getValues('email')}`
        : PATHS.auth.resetPassword;
      push(path);
      setErrorMessage(undefined);
    } catch (error) {
      setIsSubmitting(false);
      switch (error?.type) {
        default:
          setErrorMessage('Algo correu mal. Por favor tente novamente.');
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      if (router.query.email) {
        setEmail(router.query.email as string);
        setValue('email', email as string);
      }
    }
  }, [router.isReady, router.query.email, email, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && (
        <Alert sx={{ width: '100%' }} severity="error">
          {errorMessage}
        </Alert>
      )}
      <RHFTextField name="email" hiddenLabel placeholder="Email" disabled={email !== undefined} />

      <LoadingButton
        fullWidth
        size="large"
        color="inherit"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          mt: 3,
          px: 4,
          bgcolor: 'primary.main',
          color: theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
          '&:hover': {
            bgcolor: 'primary.dark',
            color: theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
          },
        }}>
        Repor Password
      </LoadingButton>
    </FormProvider>
  );
}
