import * as Yup from 'yup';
import { useCallback, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';

// utils
import { fData } from 'src/utils/formatNumber';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// assets
import { countries, genders } from 'src/data';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFPhoneField,
} from 'src/components/hook-form';
import { truncateString } from 'src/utils/functions';
// lib
import fetch from 'src/lib/fetch';
import { PATHS } from 'src/routes';
import router from 'next/router';
import { useSession } from 'next-auth/react';

// ----------------------------------------------------------------------

export default function AccountGeneral({ user }) {
  const { enqueueSnackbar } = useSnackbar();

  const [fileData, setFileData] = useState<FormData | null>(null);

  const isMdUp = useResponsive('up', 'md');
  const theme = useTheme();

  const defaultValues = {
    firstName: user?.name ? user.name.split(' ')[0] : null,
    lastName: user?.name ? user.name.split(' ').pop() : null,
    email: user?.email || '',
    picture: user?.picture || '',
    phoneNumber: user?.phone_number || '',
    gender: user?.gender || 'male',
    birthdate: user?.birthdate ? user.birthdate : '',
    address: user?.address?.street || '',
    state: user?.address?.state || '',
    city: user?.address?.city || '',
    zipCode: user?.address?.postal_code || '',
    country: user?.address?.country || '',
    fileChanged: '',
  };

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('O nome é obrigatório'),
    lastName: Yup.string().required('O apelido é obrigatório'),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = methods;

  const onSubmit = async data => {
    try {
      let fileURL;

      if (data?.fileChanged) {
        const response = await fetch('/api/files', {
          method: 'POST',
          body: fileData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.fileURL) {
          const uploadedFileURL = response.fileURL;

          fileURL = uploadedFileURL;
        }
      }

      const updateUser = {
        name: `${data.firstName} ${data.lastName}`,
        birthdate: data.birthdate,
        gender: data.gender,
        address: {
          country: data.country,
          street: data.address,
          state: data.state,
          city: data.city,
          postal_code: data.zipCode,
        },
        picture: data.fileChanged ? fileURL : data.picture,
      };

      await fetch('/api/account', {
        method: 'PUT',
        body: JSON.stringify(updateUser),
      });

      enqueueSnackbar('Guardado com sucesso!');

      // refresh the page
      window.location.reload();
    } catch (error) {
      enqueueSnackbar('Erro ao Save, por favor tente novamnete.', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];

      const formData = new FormData();
      formData.append('file', file);

      setFileData(formData);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('fileChanged', Date.now().toString());

        setValue('picture', newFile.preview, { shouldDirty: true });
      }
    },
    [setValue]
  );

  const handleConfirmPhoneClick = async () => {
    try {
      await fetch('/api/account/phone/verify', {
        method: 'POST',
      });
    } catch (error) {
      console.error(error);
    }
    router.push(PATHS.auth.verifyPhone);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="picture"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> Max size: 5MB
                </Typography>
              }
            />
            <input type="hidden" {...register('fileChanged')} /> {/* Add this line */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}>
              <RHFTextField name="firstName" label="Name" />
              <RHFTextField name="lastName" label="Surname" />

              <RHFTextField
                name="email"
                label="Email"
                disabled
                value={truncateString(user?.email as string, 32) || ''}
                tooltip={{
                  tooltipWidth: '200px',
                  icon: user?.email_verified === true ? 'simple-line-icons:check' : 'ep:warning',
                  text:
                    user?.email_verified === true
                      ? 'O seu email foi verificado com sucesso!'
                      : 'O seu email não está verificado.',
                  iconColor: user?.email_verified === true ? 'green' : 'orange',
                }}
              />

              <Box>
                <RHFPhoneField
                  name="phoneNumber"
                  label="Phone"
                  defaultCountry="PT"
                  forceCallingCode
                  disabled
                  tooltip={{
                    tooltipWidth: '200px',
                    icon: user?.phone_verified === true ? 'simple-line-icons:check' : 'ep:warning',
                    text:
                      user?.phone_verified === true
                        ? 'O seu telemóvel foi verificado com sucesso!'
                        : 'O seu telemóvel não está verificado.',
                    iconColor: user?.phone_verified === true ? 'green' : 'orange',
                  }}
                  onChange={value => {
                    /**
                     * Portuguese Number Validation
                     */

                    // If the value is +351 9123456780 -> 15 digits and has no spaces, add the spaces. (eg: +351 9123456780 -> +351 912 345 678)
                    if (value.length === 15 && value[8] !== ' ' && value[12] !== ' ') {
                      // (eg: +351 9123456780 -> +351 912 345 678)
                      const newValue = `${value.slice(0, 8)} ${value.slice(8, 11)} ${value.slice(
                        11,
                        14
                      )}`;
                      setValue('phoneNumber', newValue);
                      return;
                    }

                    // Limit the phone to 16 digits. (eg: +351 912 345 678 -> 16 digits)
                    if (value.length > 16) {
                      return;
                    }

                    setValue('phoneNumber', value);
                  }}
                />

                {user?.phone_verified !== true && (
                  <Typography
                    onClick={() => {
                      handleConfirmPhoneClick();
                    }}
                    sx={{
                      color: 'text.disabled',
                      width: 'fit-content',
                      fontSize: '12px',
                      pl: '5px',
                      pt: '5px',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}>
                    Confirm phone
                  </Typography>
                )}
              </Box>

             

             
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <LoadingButton
                sx={{
                  width: isMdUp ? 'auto' : '100%',
                  mt: isMdUp ? '20px' : '40px',
                  backgroundColor: 'primary.main',
                  color: theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    color: theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                  },
                }}
                color="inherit"
                disabled={!isDirty}
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}>
                Save
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
