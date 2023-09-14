import * as Yup from 'yup';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, TextField, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// assets
import { countries, genders } from 'src/data';

// utils
import { fData } from 'src/utils/formatNumber';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFPhoneField,
  RHFAutocomplete,
  RHFUploadAvatar,
} from 'src/components/hook-form';
// lib
import axios from 'src/lib/axios';

// ----------------------------------------------------------------------

export default function AccountGeneralCompany({ company, services }) {
  const { enqueueSnackbar } = useSnackbar();

  let file;
  let newFile;
  let formData;

  const UpdatecompanySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    name: company?.business_profile?.name || '',
    email: company?.business_profile?.email || '',
    logo: company?.business_profile?.logo || '',
    phone: company?.business_profile?.phone || '',
    country: company?.address?.country || '',
    gender: company?.gender || 'male',
    address: company?.address?.street || '',
    state: company?.address?.state || '',
    city: company?.address?.city || '',
    postalCode: company?.address?.postalCode || '',
    about: company?.about || '',
    isPublic: company?.isPublic || false,
    services: company?.services.map(service => service._id) || [],
  };

  const methods = useForm({
    resolver: yupResolver(UpdatecompanySchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async () => {
    try {
      let fileURL;

      if (file) {
        const response = await axios.post('/files', formData);

        const uploadedFileURL = response.data.data.Location;
        company.logo = uploadedFileURL;
        setValue('logo', uploadedFileURL);
      }

      axios.put(`/companys/${company?._id}`, methods.getValues());
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    acceptedFiles => {
      file = acceptedFiles[0];

      formData = new FormData();
      formData.append('file', file, file.name);

      newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('logo', newFile);
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="logo"
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
                  Permitido *.jpeg, *.jpg, *.png, *.gif
                  <br /> tamanho máximo de {fData(4995200)}
                </Typography>
              }
            />
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
              <RHFTextField name="name" label="Nome Empresa" disabled />

              <RHFSelect name="gender" label="Género" placeholder="Gender" native>
                <option value="" />
                {genders.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="email" label="Email" disabled />

              <RHFPhoneField
                name="phone"
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
                    const newValue = `${value.slice(0, 8)} ${value.slice(8, 11)} ${value.slice(
                      11,
                      14
                    )}`;
                    setValue('phone', newValue);
                    return;
                  }

                  // Limit the phone to 16 digits. (eg: +351 912 345 678 -> 16 digits)
                  if (value.length > 16) {
                    return;
                  }

                  setValue('phone', value);
                }}
              />

              <RHFAutocomplete
                name="services"
                aria-multiline="false"
                multiple
                disabled
                freeSolo
                options={services.map(option => option._id)}
                getOptionLabel={_id => services.find(option => option._id === _id)?.name || ''}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      label={services.find(item => item._id === option)?.name || ''}
                    />
                  ))
                }
              />

              <RHFTextField name="address" label="Morada" />
              <RHFTextField name="postalCode" label="Código Postal" />

              <RHFTextField name="city" label="Cidade" />

              <RHFSelect name="country" label="País" placeholder="Country">
                <option value={company?.address?.country} />
                {countries.map(option => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack spacing={5} alignItems="flex-end" sx={{ mt: 5 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isDirty}>
                Guardar
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
