import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseISO } from 'date-fns';
// next
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import NextLink from 'next/link';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MapView from 'src/components/map-view';
// @mui
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  Autocomplete,
  TextField,
  Button,
  Chip,
  CardContent,
  styled,
} from '@mui/material';
// utils
import { fData } from 'src/utils/formatNumber';
// assets
import { countries, roles, genders } from 'src/data';
// routes
import { PATHS } from 'src/routes';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFPhoneField,
  RHFTextField,
  RHFUploadAvatar,
  RHFCheckbox,
  RHFSwitch,
} from 'src/components/hook-form';
import Tooltip from 'src/components/tooltip';
// lib
import fetch from 'src/lib/fetch';
import { useSession } from 'next-auth/react';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  editHealthUnit: PropTypes.object,
  services: PropTypes.array,
  user: PropTypes.object,
};

const StyledMapContainer = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

export default function UserNewEditForm({
  isNew = false,
  isEdit = false,
  isView = false,
  editHealthUnit,
  services,
}) {
  const { push } = useRouter();

  const [currentTab, setCurrentTab] = useState('details');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const { data: user } = useSession();

  const [isCaregiver, setIsCaregiver] = useState(editHealthUnit?.role === 'caregiver');
  const [showPermissions, setShowPermissions] = useState(
    editHealthUnit?.permissions?.includes('app_user') || false
  );
  const [fileData, setFileData] = useState<FormData | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('O nome é obrigatório.'),
    lastName: Yup.string().required('O apelido é obrigatório.'),
    email: Yup.string().required('O email é obrigatório.'),
    phoneNumber: Yup.string().required('O número de telefone é obrigatório.'),
    birthdate: Yup.date().required('A data de nascimento é obrigatória.'),
    gender: Yup.string().required('O gênero é obrigatório.'),
    role: Yup.string().required('O cargo é obrigatório.'),

    /**
     *     street: Yup.string().required('A rua é obrigatória.'),
    postal_code: Yup.string().required('O código postal é obrigatório.'),
    city: Yup.string().required('A cidade é obrigatória.'),
    country: Yup.string().required('O país é obrigatório.'),
     */

    // if the role is caregiver, then the services are required
    services: Yup.array().when('role', {
      is: 'caregiver',
      then: Yup.array().required('Os serviços são obrigatórios.'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      logo: editHealthUnit?.business_profile.logo || '',
      fileChanged: '',

      name: editHealthUnit?.business_profile.name || '',
      website: editHealthUnit?.business_profile.website || '',
      about: editHealthUnit?.business_profile.about || '',
      email: editHealthUnit?.business_profile.email || '',
      phoneNumber: editHealthUnit?.business_profile.phone || '',
      services: editHealthUnit?.services || [],
      facebook: editHealthUnit?.business_profile.social_links.facebook || '',
      linkedin: editHealthUnit?.business_profile.social_links.linkedin || '',
      instagram: editHealthUnit?.business_profile.social_links.instagram || '',
      twitter: editHealthUnit?.business_profile.social_links.twitter || '',

      service_area: editHealthUnit?.service_area || '',

      minimumHourlyPrice: editHealthUnit?.pricing?.minimum_hourly_rate || '',
      averageHourlyPrice: editHealthUnit?.pricing?.average_hourly_rate || '',
      minimumMonthlyPrice: editHealthUnit?.pricing?.minimum_monthly_rate || '',
      averageMonthlyPrice: editHealthUnit?.pricing?.average_monthly_rate || '',

      directorName: editHealthUnit?.legal_information.director?.name.split(' ')[0] || '',
      directorSurname: editHealthUnit?.legal_information.director?.name.split(' ')[1] || '',
      directorEmail: editHealthUnit?.legal_information.director?.email || '',
      directorPhone: editHealthUnit?.legal_information.director?.phone || '',
      directorStreet: editHealthUnit?.legal_information.director?.address?.street || '',
      directorPostalCode: editHealthUnit?.legal_information.director?.address?.postal_code || '',
      directorCity: editHealthUnit?.legal_information.director?.address?.city || '',
      directorCountry: editHealthUnit?.legal_information.director?.address?.country || '',

      companyLegalName: editHealthUnit?.legal_information.name || '',
      taxNumber: editHealthUnit?.legal_information.tax_number || '',
      businessStructure: editHealthUnit?.legal_information.business_structure || '',
      street: editHealthUnit?.legal_information?.street || '',
      postal_code: editHealthUnit?.legal_information?.postal_code || '',
      city: editHealthUnit?.legal_information?.city || '',
      state: editHealthUnit?.legal_information?.state || '',
      country: editHealthUnit?.legal_information?.country || '',
    }),

    [editHealthUnit]
  );

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    register,
    reset,
    watch,
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async data => {
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

    // ------------------------------ //

    const _user = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phoneNumber,
      birthdate: data.birthdate,
      gender: data.gender,
      logo: data.fileChanged ? fileURL : data.logo,
      address: {
        street: data.street,
        postal_code: data.postal_code,
        city: data.city,
        state: data.state,
        country: data.country,
      },
      role: data.role,
      company: data.company,
      ...(data.role === 'caregiver' && { services: data.services }),
    };

    if (isEdit) {
      let response;

      try {
        response = await fetch(`/api/health-units/${editHealthUnit._id}`, {
          method: 'PUT',
          body: JSON.stringify(_user),
        });

        if (response.error) {
          throw new Error(response.statusText);
        }

        enqueueSnackbar('Colaborador atualizado com sucesso!');
      } catch (err) {
        switch (err.message) {
          default:
            enqueueSnackbar(
              'Ocorreu um erro ao atualizar o colaborador. Por favor tente novamente.',
              {
                variant: 'error',
              }
            );
        }
      }
    }

    if (isNew) {
      let response;

      try {
        response = await fetch('/api/health-units', {
          method: 'POST',
          body: JSON.stringify(_user),
        });

        if (response.error) {
          throw new Error(response.statusText);
        }
        enqueueSnackbar('Colaborador adicionado com sucesso!');

        window.location.href = '';
      } catch (err) {
        switch (err.message) {
          default:
            enqueueSnackbar(
              'Ocorreu um erro ao adicionar o colaborador. Por favor tente novamente.',
              {
                variant: 'error',
              }
            );
        }
      }
    }
  };

  const handleDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0]; // eslint-disable-line

      const formData = new FormData();
      formData.append('file', file);

      setFileData(formData);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('fileChanged', Date.now().toString()); // update the hidden field

        setValue('logo', newFile.preview, { shouldDirty: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Card sx={{ p: 3, mt: 3, ml: 3, mr: 3 }}>
          <RHFUploadAvatar
            disabled={isView}
            name="logo"
            maxSize={3145728}
            onDrop={handleDrop}
            helperText={
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  mb: 5,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.secondary',
                }}>
                Permitido *.jpeg, *.jpg, *.png, *.gif
                <br /> tamanho máximo de {fData(5045728)}
              </Typography>
            }
          />
          <input type="hidden" {...register('fileChanged')} /> {/* Add this line */}
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}>
            <Typography variant="h4">Details</Typography>
            <Typography variant="h4"></Typography>

            <RHFTextField
              name="name"
              label="Nome *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="website"
              label="Website *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="email"
              label="Email *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFPhoneField
              disabled={isView}
              name="phoneNumber"
              label="Telefone *"
              defaultCountry="PT"
              forceCallingCode
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

            <RHFAutocomplete
              name="services"
              label="Services *"
              InputLabelProps={{ shrink: true }}
              aria-multiline="false"
              multiple
              disabled={isView}
              freeSolo
              sx={{ width: '100%' }}
              options={services.map(option => option._id)}
              getOptionLabel={_id => services.find(option => option._id === _id)?.name || ''}
              onChange={(event, newValue) => {
                setValue('services', newValue);

                if (newValue.length === 0) {
                  setValue('services', []);
                }
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    size="small"
                    label={services.find(item => item._id === option)?.name || ''}
                  />
                ))
              }
            />

            <RHFTextField
              name="about"
              label="About *"
              multiline
              minRows={6}
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              label="Facebook"
              name="facebook"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              label="LinkedIn"
              name="linkedin"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              label="Instagram"
              name="instagram"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              label="Twitter"
              name="twitter"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <Typography variant="h4" sx={{ mt: 10 }}>
              Service Area
            </Typography>
            <Typography variant="h4"></Typography>

            <MapView sx={{ gridColumn: 'span 2' }} />

            <Typography variant="h4">Pricing</Typography>
            <Typography variant="h4"></Typography>

            <RHFTextField
              label="Minimum Hourly Price"
              name="minimumHourlyPrice"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              label="Average Hourly Price"
              name="averageHourlyPrice"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              label="Minimum Monthly Price"
              name="minimumMonthlyPrice"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              label="Average Monthly Price"
              name="averageMonthlyPrice"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <Typography variant="h4" sx={{ pt: 5 }}>
              Director
            </Typography>
            <Typography variant="h4"></Typography>

            <RHFTextField
              name="directorName"
              label="Name *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="directorSurname"
              label="Surname *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="directorEmail"
              label="Email *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFPhoneField
              disabled={isView}
              name="directorPhone"
              label="Telefone *"
              defaultCountry="PT"
              forceCallingCode
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

            <RHFTextField
              name="directorStreet"
              label="Street"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
              disabled={isView}
              InputLabelProps={{ shrink: true }}
              name="directorPostalCode"
              label="Postal Code"
              onChange={e => {
                const { value } = e.target;

                /**
                 * Only allow numbers and dashes
                 */
                if (!/^[0-9-]*$/.test(value)) {
                  return;
                }

                /**
                 * Portugal Zip Code Validation
                 */
                if (getValues('country') === 'PT' || getValues('country') === '') {
                  // Add a dash to the zip code if it doesn't have one. Format example: XXXX-XXX
                  if (value.length === 5 && value[4] !== '-') {
                    setValue(
                      'postal_code',
                      `${value[0]}${value[1]}${value[2]}${value[3]}-${value[4]}`
                    );
                    return;
                  }

                  // Do not allow the zip code to have more than 8 digits (XXXX-XXX -> 8 digits)
                  if (value.length > 8) {
                    return;
                  }
                }

                setValue('postal_code', value);
              }}
            />

            <RHFTextField
              name="directorCity"
              label="City"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFSelect
              native
              name="directorCountry"
              label="Country"
              disabled={isView}
              InputLabelProps={{ shrink: true }}>
              <option value="" />
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </RHFSelect>

            <Typography variant="h4" sx={{ pt: 5 }}>
              Legal Information
            </Typography>
            <Typography variant="h4"></Typography>

            <RHFTextField
              name="companyLegalName"
              label="Company Legal Name"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="taxNumber"
              label="Tax Number"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="businessStructure"
              label="Business Structure"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
              name="street"
              label="Rua"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
              disabled={isView}
              InputLabelProps={{ shrink: true }}
              name="postal_code"
              label="Código Postal"
              onChange={e => {
                const { value } = e.target;

                /**
                 * Only allow numbers and dashes
                 */
                if (!/^[0-9-]*$/.test(value)) {
                  return;
                }

                /**
                 * Portugal Zip Code Validation
                 */
                if (getValues('country') === 'PT' || getValues('country') === '') {
                  // Add a dash to the zip code if it doesn't have one. Format example: XXXX-XXX
                  if (value.length === 5 && value[4] !== '-') {
                    setValue(
                      'postal_code',
                      `${value[0]}${value[1]}${value[2]}${value[3]}-${value[4]}`
                    );
                    return;
                  }

                  // Do not allow the zip code to have more than 8 digits (XXXX-XXX -> 8 digits)
                  if (value.length > 8) {
                    return;
                  }
                }

                setValue('postal_code', value);
              }}
            />

            <RHFTextField
              name="city"
              label="Cidade"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFSelect
              native
              name="country"
              label="País"
              disabled={isView}
              InputLabelProps={{ shrink: true }}>
              <option value="" />
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </RHFSelect>
            <Typography variant="h4"></Typography>

            <Typography
              sx={{ fontSize: '12px', color: '#91A0AD', marginTop: '10px', marginLeft: '5px' }}>
              * Mandatory field
            </Typography>

            <Typography variant="h4"></Typography>
          </Box>
          {!isView && (
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isDirty}
                onClick={handleSubmit(onSubmit)}>
                {!isEdit ? 'Adicionar' : 'Guardar'}
              </LoadingButton>
            </Stack>
          )}
        </Card>
      </Grid>
    </FormProvider>
  );
}
