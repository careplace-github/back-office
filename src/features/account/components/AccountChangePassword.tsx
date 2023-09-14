// react
import { useState } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card, InputAdornment, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// lib
import fetch from 'src/lib/fetch';
import { useSession } from 'next-auth/react';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { data: user } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .min(6, 'A password tem de ter no mínimo 5 caracteres')
      .required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowConfirmNewPassword = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async data => {
    try {
      const req = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };

      await fetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(req),
      });

      reset();
      enqueueSnackbar('Guardado com sucesso!');
    } catch (error) {
      switch (error.type) {
        case 'UNAUTHORIZED':
          enqueueSnackbar('A password antiga está incorreta!', { variant: 'error' });
          break;
        default:
          enqueueSnackbar('Erro ao guardar, por favor tente novamnete.', { variant: 'error' });
      }

      console.error('error: ', error);
      console.error('error.type: ', error.type);
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          <RHFTextField
            name="oldPassword"
            type={showOldPassword ? 'text' : 'password'}
            label="Password Antiga"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowOldPassword} edge="end">
                    <Iconify icon={showOldPassword ? 'carbon:view' : 'carbon:view-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            label="Nova Password"
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> A password tem de ter
                6+ caracteres
              </Stack>
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowNewPassword} edge="end">
                    <Iconify icon={showNewPassword ? 'carbon:view' : 'carbon:view-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirmNewPassword"
            type={showConfirmNewPassword ? 'text' : 'password'}
            label="Confirmar Nova Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowConfirmNewPassword} edge="end">
                    <Iconify icon={showConfirmNewPassword ? 'carbon:view' : 'carbon:view-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isDirty}>
            Guardar
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
