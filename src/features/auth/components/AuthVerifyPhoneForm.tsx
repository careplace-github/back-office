import { useState, useEffect } from 'react';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
import NextLink from 'next/link';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  FormHelperText,
  Box,
  Typography,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATHS } from 'src/routes';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFPhoneField, RHFCodes } from 'src/components/hook-form';
import useCountdown from 'src/hooks/useCountdown';
// lib
import axios from 'src/lib/axios';
// contexts

// ----------------------------------------------------------------------

type FormValuesProps = {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  phoneNumber: string;
};

export default function AuthNewPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();

  const { push } = useRouter();
  const router = useRouter();

  const [phoneNumberRecovery, setphoneNumberRecovery] = useState(
    router.query.phone as string | null
  );
  const [resendAvailable, setResendAvailable] = useState(false);
  // The component takes around 2 seconds to initialize so we need to set the countdown to 47 seconds for it to start at 45
  const countdown = useCountdown(new Date(Date.now() + 47000));

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required('Code is required'),
    code2: Yup.string().required('Code is required'),
    code3: Yup.string().required('Code is required'),
    code4: Yup.string().required('Code is required'),
    code5: Yup.string().required('Code is required'),
    code6: Yup.string().required('Code is required'),
    phoneNumber: Yup.string().required('phoneNumber is required'),
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
    phoneNumber: phoneNumberRecovery || '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
    getValues,
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const code =
        getValues('code1') +
        getValues('code2') +
        getValues('code3') +
        getValues('code4') +
        getValues('code5') +
        getValues('code6');

      // Show success message popup
      enqueueSnackbar('Telemóvel verificado com sucesso!');

      push(PATHS.auth.login);
    } catch (error) {
      console.error(error);

      // Show error message popup
      enqueueSnackbar('Ocorreu um erro ao verificar o telemóvel, por favor tente novamente.!');
    }
  };

  /**
   * Resend the reset password code
   */
  const onResendCode = async () => {
    try {
      const phoneNumber = getValues('phoneNumber');

      if (!phoneNumber || phoneNumber == '' || errors.phoneNumber) return;

      // The component takes around 2 seconds to initialize so we need to set the countdown to 47 seconds for it to start at 45
      countdown.update(new Date(Date.now() + 47000));

      // Wait 1 second for the countdown component to update
      setTimeout(() => {
        setResendAvailable(false);
      }, 1000);

      // Show success message popup
      enqueueSnackbar('Código enviado com sucesso!');
    } catch (error) {
      enqueueSnackbar('Ocorreu um erro ao enviar o código, por favor tente novamente.');
      // Show error message popup
      console.error(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      if (router.query.phone) {
        setphoneNumberRecovery(router.query.phone as string);
        setValue('phoneNumber', router.query.phone as string);
      }
    }
  }, [router.isReady, router.query?.phoneNumber, phoneNumberRecovery]);

  // Set the resendvaialble to true when the countdown ends
  useEffect(() => {
    // The countdown starts at 00 so we need to check if it's 01 and if the resend is not available yet
    if (countdown.seconds == '01' && resendAvailable == false) {
      // Reset the resend available

      // Wait 1 second
      setTimeout(() => {
        setResendAvailable(true);
      }, 1000);
    }
  }, [countdown]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFPhoneField
          name="phoneNumber"
          label="Telefone"
          defaultCountry="PT"
          forceCallingCode
          disabled
          onChange={value => {
            /**
             * Portuguese Number Validation
             */

            // If the value is +351 9123456780 -> 15 digits and has no spaces, add the spaces. (eg: +351 9123456780 -> +351 912 345 678)
            if (value.length === 15 && value[8] !== ' ' && value[12] !== ' ') {
              // (eg: +351 9123456780 -> +351 912 345 678)
              const newValue = `${value.slice(0, 8)} ${value.slice(8, 11)} ${value.slice(11, 14)}`;
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

        <RHFCodes
          keyName="code"
          inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']}
          sx={{
            justifyContent: 'space-between',
          }}
        />

        {resendAvailable && (
          <Typography variant="body2" sx={{ my: 3 }}>
            Não recebeu o código? &nbsp;
            <Link
              variant="subtitle2"
              onClick={() => onResendCode()}
              sx={{
                cursor: 'pointer',
              }}>
              Pedir novo código
            </Link>
          </Typography>
        )}

        {!resendAvailable && (
          // Add margin bottom to the text
          <Typography variant="body2" sx={{}}>
            Poderá pedir um novo código em:
          </Typography>
        )}

        {!resendAvailable && (
          // Add margin bottom to the text
          <Typography
            variant="body2"
            color="primary"
            sx={{
              fontWeight: 'bold',
              mt: -20,
            }}>
            {countdown.seconds} segundos
          </Typography>
        )}

        {(!!errors.code1 ||
          !!errors.code2 ||
          !!errors.code3 ||
          !!errors.code4 ||
          !!errors.code5 ||
          !!errors.code6) && (
          <FormHelperText error sx={{ px: 2 }}>
            O código é obrigatório
          </FormHelperText>
        )}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}>
          Verificar Telemóvel
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
