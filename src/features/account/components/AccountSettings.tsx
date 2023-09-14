// react
import { useState } from 'react';
// Yup
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import { ISnackbarProps } from 'src/types/snackbar';
// routes
import { useRouter } from 'next/router';
import { PATHS } from 'src/routes';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Typography, Snackbar, Alert, Card, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// data
import { countries } from 'src/data';
// axios
import axios from 'src/lib/axios';
// components
import FormProvider, { RHFPhoneField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountSettingsChangePhone() {
  const isMdUp = useResponsive('up', 'md');
  const theme = useTheme();
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState<ISnackbarProps>({
    show: false,
    severity: 'success',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const ChangePhoneSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .test('phoneNumber', 'O número de telemóvel é obrigatório', value => {
        // If the value is equal to a country phone number, then it is empty
        const code = countries.find(country => country.phone === value?.replace('+', ''))?.phone;
        const phoneNumber = value?.replace('+', '');

        return code !== phoneNumber;
      })
      .test('phoneNumber', 'O número de telemóvel introduzido não é válido.', value => {
        // Portuguese phone number verification
        if (value?.startsWith('+351')) {
          // Remove spaces and the +351 sign
          value = value?.replace(/\s/g, '').replace('+351', '');

          // Check if the phone number is valid
          return value?.length === 9;
        }

        return true;
      }),
  });

  const defaultValues = {
    phoneNumber: '+351',
  };

  const methods = useForm<typeof defaultValues>({
    mode: 'onBlur',
    resolver: yupResolver(ChangePhoneSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    formState: { isValid },
  } = methods;

  const changeUserPhoneNumber = async newPhone => {
    try {
      await fetch('/api/auth/change-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify({
          // Serialize the object into a JSON string
          phone: newPhone,
        }),
      });

      setShowSnackbar({
        show: true,
        severity: 'success',
        message: 'O seu número de telemóvel foi alterado com sucesso.',
      });

      router.push(PATHS.auth.verifyPhone);
    } catch (error) {
      setShowSnackbar({
        show: true,
        severity: 'error',
        message: 'Algo correu mal, por favor tente novamente.',
      });
      console.error(error);
    }
  };

  const handleOnSubmit = async () => {
    setIsSubmitting(true);
    const data = getValues();
    // Remove spaces from the phone number
    const newPhone = data.phoneNumber.replace(/\s/g, '') as string;
    try {
      await changeUserPhoneNumber(newPhone);
    } catch (error) {
      console.error('error', error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Snackbar
        open={showSnackbar.show}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() =>
          setShowSnackbar({
            show: false,
            severity: 'success',
            message: '',
          })
        }>
        <Alert
          onClose={() =>
            setShowSnackbar({
              show: false,
              severity: 'success',
              message: '',
            })
          }
          severity={showSnackbar.severity}
          sx={{ width: '100%' }}>
          {showSnackbar.message}
        </Alert>
      </Snackbar>

      <FormProvider methods={methods}>
        <Card>
          <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, width: '100%', textAlign: 'left' }}>
              Change Phone
            </Typography>

            <RHFPhoneField
              name="phoneNumber"
              sx={{
                width: '100%',
                '& > div': {
                  width: '100%',
                },
              }}
              label="Phone"
              defaultCountry="PT"
              forceCallingCode
              fullWidth
              flagSize="small"
              onChange={(value: string) => {
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
                size="large"
                variant="contained"
                disabled={!isValid}
                loading={isSubmitting}
                onClick={handleOnSubmit}>
                Change Phone
              </LoadingButton>
            </Box>
          </Stack>
        </Card>
      </FormProvider>
    </>
  );
}
