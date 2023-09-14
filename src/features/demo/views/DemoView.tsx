import { useEffect, useState } from 'react';
// YUP
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Typography, Container, Stack, Grid, Box } from '@mui/material';
// axios
import axios from 'src/lib/axios';
// components
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFPhoneField, RHFSelect } from 'src/components/hook-form';
// data
import { countries } from 'src/data';
// types

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  phoneNumber: string;
  firstName: string;
  company: string;
  companyType: string;
  companySize: string;
  role: string;
  lastName: string;
};

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  // Company type available options
  const companyTypeOptions = [
    { text: 'Empresa SAD', value: 'agency' },
    { text: 'Residência Sénior', value: 'senior_residence' },
    { text: 'Lar de Idosos', value: 'retirement_home' },
    { text: 'Outro ', value: 'other' },
  ];

  // Company size available options
  const companySizeOptions = [
    { text: '1-9', value: '1-9' },
    { text: '10-19', value: '10-19' },
    { text: '20-50', value: '20-50' },
    { text: '50+', value: '50+' },
  ];

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('O nome é obrigatório.')
      .min(3, 'O nome deve ter pelo menos 3 caracteres.')
      .max(50, 'O nome deve ter no máximo 50 caracteres.'),
    lastName: Yup.string()
      .required('O nome é obrigatório.')
      .min(3, 'O nome deve ter pelo menos 3 caracteres.')
      .max(50, 'O nome deve ter no máximo 50 caracteres.'),
    email: Yup.string()
      .required('O email é obrigatório.')
      .email('O email introduzido não é válido.'),
    company: Yup.string().required('O nome da Empresa é obrigatório.'),
    role: Yup.string().required('O cargo é obrigatório.'),
    companyType: Yup.string().required('O tipo de Empresa é obrigatório.'),
    companySize: Yup.string().required('O tamanho da Empresa é obrigatório.'),
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
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    companyType: '',
    companySize: '',
    phoneNumber: '+351',
  };

  const methods = useForm<FormValuesProps>({
    mode: 'onBlur',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    getValues,
    setValue,
    reset,
    formState: { isValid },
  } = methods;

  useEffect(() => {}, [isValid]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const values = getValues();
      const data = {
        name: `${values.firstName.replaceAll(' ', '')} ${values.lastName.replaceAll(' ', '')}`,
        email: values.email,
        company: values.company,
        company_type: values.companyType,
        company_size: values.companySize,
        role: values.role,
        phone: values.phoneNumber,
      };
      await axios.post('/leads/health-unit', data);
      enqueueSnackbar('Os seus dados foram enviados com sucesso.');
    } catch (error) {
      if (error?.response?.data?.error?.message === 'Lead already exists') {
        enqueueSnackbar('Os seus dados já foram enviados.', { variant: 'warning' });
      } else {
        enqueueSnackbar('Algo correu mal, tente novamente.', { variant: 'error' });
      }
    }
    reset();
    setIsSubmitting(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        p: { xs: 4 },
        pt: { xs: '50px', sm: 0 },
      }}>
      {' '}
      <Stack
        sx={{
          py: 9,
          pt: 0,
          maxWidth: '5000px',
          width: '100%',
          minHeight: '100vh',
          // height: 'auto',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Typography variant="h3">Gostaría de obter uma demonstração?</Typography>

        <Typography variant="body2" sx={{ mt: 2, mb: 5, color: 'text.secondary' }}>
          Introduza os seus dados em baixo. Entraremos em contacto consigo assim que possível.
        </Typography>

        <FormProvider methods={methods}>
          <Stack direction="column" gap="20px">
            <Grid
              container
              sx={{ justifyContent: 'space-between', gap: { xs: '20px', sm: '0px' } }}>
              <Grid sm={5.8} xs={12}>
                <RHFTextField name="firstName" label="Nome" />
              </Grid>
              <Grid sm={5.8} xs={12}>
                <RHFTextField name="lastName" label="Apelido" />
              </Grid>
            </Grid>
            <RHFTextField name="email" label="Email" />
            <RHFPhoneField
              name="phoneNumber"
              label="Telemóvel"
              defaultCountry="PT"
              forceCallingCode
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
            <RHFTextField name="company" label="Empresa" />
            <Grid
              container
              sx={{ justifyContent: 'space-between', gap: { xs: '20px', sm: '0px' } }}>
              <Grid sm={5.8} xs={12}>
                <RHFSelect name="companyType" label="Tipo de Empresa" native>
                  <option value=""></option>
                  {companyTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid sm={5.8} xs={12}>
                <RHFSelect name="companySize" label="Número de Colaboradores" native>
                  <option value=""></option>
                  {companySizeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>
            <RHFTextField name="role" label="Cargo" />

            <LoadingButton
              onClick={handleSubmit}
              variant="contained"
              disabled={!isValid}
              loading={isSubmitting}
              sx={{ height: '48px' }}>
              Submeter
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Stack>
    </Box>
  );
}
