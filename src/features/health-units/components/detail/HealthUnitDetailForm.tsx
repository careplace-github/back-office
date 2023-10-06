import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
// next
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DrawableMap from 'src/components/drawable-map/DrawableMap';
// @mui
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { useResponsive } from 'src/hooks/use-responsive';
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
  InputAdornment,
  Modal,
} from '@mui/material';
// utils
import { fData } from 'src/utils/formatNumber';
import { Tooltip as MuiTooltip } from '@mui/material';
import { useTheme } from '@emotion/react';
// assets
import { countries, healthUnitTypes, roles, genders } from 'src/data';
// routes
import { PATHS } from 'src/routes';
// components
import { useSnackbar } from 'src/components/snackbar';
import PromptPopup from 'src/components/prompt-popup/PromptPopup';
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
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import ConfirmDialog from 'src/components/confirm-dialog';
import { s } from '@fullcalendar/core/internal-common';
import HealthUnitBillingAddresses from '../../billing-address/HealthUnitBilingAddresses';
import HealthUnitBankAccounts from '../../bank-accounts/HealthUnitBankAccounts';

// ----------------------------------------------------------------------

HealthUnitDetailForm.propTypes = {
  isEdit: PropTypes.bool,
  isNew: PropTypes.bool,
  healthUnit: PropTypes.object,
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

export default function HealthUnitDetailForm({ isNew, isEdit, healthUnit, services }) {
  const { push } = useRouter();
  const [customIsDirty, setCustomIsDirty] = useState<boolean>(false);
  const [isFetchingHealthUnit, setIsFetchingHealthUnit] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentHealthUnit, setCurrentHealthUnit] = useState<any>(healthUnit || null);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);
  const [isLoadingExternalAccounts, setIsLoadingExternalAccounts] = useState<boolean>(true);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<{
    show: boolean;
    id: string | undefined;
  }>({ show: false, id: undefined });
  const [openConfirmDeleteAccountModal, setOpenConfirmDeleteAccountModal] = useState<{
    show: boolean;
    id: string | undefined;
  }>({ show: false, id: undefined });

  const [serviceArea, setServiceArea] = useState<any>(
    currentHealthUnit?.service_area || { type: 'MultiPolygon', coordinates: [] }
  );

  const [healthUnitExternalAccounts, setHealthUnitExternalAccounts] = useState<any>([]);

  const fetchHealthUnitExternalAccounts = async () => {
    setIsLoadingExternalAccounts(true);
    try {
      const externalAccounts = await fetch(
        `/api/health-units/${healthUnit._id}/external-accounts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setHealthUnitExternalAccounts(externalAccounts.data);
    } catch (error) {
      console.log('error');
    }
    setIsLoadingExternalAccounts(false);
  };

  useEffect(() => {
    fetchHealthUnitExternalAccounts();
  }, []);

  const billingAddresses = currentHealthUnit?.billing_addresses || [];

  const [fileData, setFileData] = useState<FormData | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({});

  const fetchHealthUnitInfo = async () => {
    setIsFetchingHealthUnit(true);
    try {
      const response = await fetch(`/api/health-units/${currentHealthUnit._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setCurrentHealthUnit(response);
    } catch (error) {
      console.log('error', error);
    }
    setIsFetchingHealthUnit(false);
  };

  const defaultValues = useMemo(
    () => ({
      isActive: currentHealthUnit?.is_active || false,

      logo: currentHealthUnit?.business_profile.logo || '',
      fileChanged: '',

      name: currentHealthUnit?.business_profile.name || '',
      website: currentHealthUnit?.business_profile.website || '',
      about: currentHealthUnit?.business_profile.about || '',
      email: currentHealthUnit?.business_profile.email || '',
      phoneNumber: currentHealthUnit?.business_profile.phone || '',
      services: currentHealthUnit?.services || [],
      facebook: currentHealthUnit?.business_profile.social_links.facebook || '',
      linkedin: currentHealthUnit?.business_profile.social_links.linkedin || '',
      instagram: currentHealthUnit?.business_profile.social_links.instagram || '',
      twitter: currentHealthUnit?.business_profile.social_links.twitter || '',
      type: currentHealthUnit?.type || '',

      service_area: currentHealthUnit?.service_area || '',

      minimumHourlyPrice: currentHealthUnit?.pricing?.minimum_hourly_rate || '',
      averageHourlyPrice: currentHealthUnit?.pricing?.average_hourly_rate || '',
      minimumMonthlyPrice: currentHealthUnit?.pricing?.minimum_monthly_rate || '',
      averageMonthlyPrice: currentHealthUnit?.pricing?.average_monthly_rate || '',

      directorName: currentHealthUnit?.legal_information.director?.name.split(' ')[0] || '',
      directorSurname: currentHealthUnit?.legal_information.director?.name.split(' ')[1] || '',
      directorEmail: currentHealthUnit?.legal_information.director?.email || '',
      directorPhone: currentHealthUnit?.legal_information.director?.phone || '',
      directorStreet: currentHealthUnit?.legal_information.director?.address?.street || '',
      directorPostalCode: currentHealthUnit?.legal_information.director?.address?.postal_code || '',
      directorCity: currentHealthUnit?.legal_information.director?.address?.city || '',
      directorCountry: currentHealthUnit?.legal_information.director?.address?.country || '',
      directorRole: currentHealthUnit?.legal_information.director?.role || '',
      directorBirthdate: currentHealthUnit?.legal_information.director?.birthdate || '',

      companyLegalName: currentHealthUnit?.legal_information.name || '',
      taxNumber: currentHealthUnit?.legal_information.tax_number || '',
      businessStructure: currentHealthUnit?.legal_information.business_structure || '',
      street: currentHealthUnit?.legal_information?.address.street || '',
      postal_code: currentHealthUnit?.legal_information?.address.postal_code || '',
      city: currentHealthUnit?.legal_information?.address.city || '',
      state: currentHealthUnit?.legal_information?.address.state || '',
      country: currentHealthUnit?.legal_information?.address.country || 'PT',
    }),

    [currentHealthUnit]
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

    const _healthUnit = {
      business_profile: {
        name: data.name,
        about: data.about,
        email: data.email,
        phone: data.phoneNumber,
        website: data.website,
        logo: fileURL || data.logo,
        social_links: {
          facebook: data.facebook,
          linkedin: data.linkedin,
          instagram: data.instagram,
          twitter: data.twitter,
        },
      },
      type: data.type,
      service_area: {
        ...serviceArea,
      },
      pricing: {
        minimum_hourly_rate: data.minimumHourlyPrice,
        average_hourly_rate: data.averageHourlyPrice,
        minimum_monthly_rate: data.minimumMonthlyPrice,
        average_monthly_rate: data.averageMonthlyPrice,
      },
      legal_information: {
        name: data.companyLegalName,
        tax_number: data.taxNumber,
        business_structure: data.businessStructure,
        director: {
          name: `${data.directorName} ${data.directorSurname}`,
          email: data.directorEmail,
          phone: data.directorPhone,
          address: {
            street: data.directorStreet,
            postal_code: data.directorPostalCode,
            city: data.directorCity,
            country: data.directorCountry,
          },
        },
        address: {
          street: data.street,
          postal_code: data.postal_code,
          city: data.city,
          country: data.country,
        },
      },
      services: data.services,
      is_active: data.isActive,
    };

    if (isEdit) {
      let response;

      try {
        response = await fetch(`/api/health-units/${currentHealthUnit._id}`, {
          method: 'PUT',
          body: JSON.stringify(_healthUnit),
        });

        if (response.error) {
          throw new Error(response.statusText);
        }

        enqueueSnackbar('Health unit updated successfully!');
      } catch (err) {
        switch (err.message) {
          default:
            enqueueSnackbar('An error occurred while updating the health unit. Please try again.', {
              variant: 'error',
            });
        }
      }
    }

    if (isNew) {
      let response;

      try {
        response = await fetch('/api/health-units', {
          method: 'POST',
          body: JSON.stringify(_healthUnit),
        });

        if (response.error) {
          throw new Error(response.statusText);
        }

        enqueueSnackbar('Health unit created with success!');

        // send to the health unit page
        push(PATHS.healthUnits.view(response._id));
      } catch (err) {
        switch (err.message) {
          default:
            enqueueSnackbar('An error occurred while creating the health unit. Please try again.', {
              variant: 'error',
            });
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

  const handleAddNewAddress = async (address: any) => {
    try {
      const addresses = currentHealthUnit?.billing_addresses || [];
      // remove previous primary tag
      if (address.primary) {
        addresses.forEach(a => {
          a.primary = false;
        });
      }
      addresses.push(address);
      await fetch(`/api/health-units/${currentHealthUnit._id}`, {
        method: 'PUT',
        body: JSON.stringify({ billing_addresses: addresses }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar('Billing Address added successfuly.');
      fetchHealthUnitInfo();
    } catch (error) {
      enqueueSnackbar('Something went wrong, try again.', {
        variant: 'error',
      });
      fetchHealthUnitInfo();
    }
  };

  const handleUpdateAddress = async (addressToEdit: any) => {
    try {
      const addresses = currentHealthUnit?.billing_addresses;
      addresses?.forEach((a, index) => {
        if (a._id === addressToEdit._id) {
          addresses[index] = addressToEdit;
        }
      });
      await fetch(`/api/health-units/${currentHealthUnit._id}`, {
        method: 'PUT',
        body: JSON.stringify({ billing_addresses: addresses }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar('Billing Address updated successfuly.');
      fetchHealthUnitInfo();
    } catch (error) {
      enqueueSnackbar('Something went wrong, try again.', {
        variant: 'error',
      });
      fetchHealthUnitInfo();
    }
  };

  const handleDeleteAddress = async (id: any) => {
    setIsDeleting(true);
    const addresses = currentHealthUnit?.billing_addresses?.filter(a => a._id !== id);
    try {
      await fetch(`/api/health-units/${currentHealthUnit._id}`, {
        method: 'PUT',
        body: JSON.stringify({ billing_addresses: addresses }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar('Billing Address deleted successfuly.');
      fetchHealthUnitInfo();
      setOpenConfirmDeleteModal({ show: false, id: undefined });
    } catch (error) {
      enqueueSnackbar('Something went wrong, try again.', {
        variant: 'error',
      });
      fetchHealthUnitInfo();
    }
    setIsDeleting(false);
    // const addresses = currentHealthUnit?.billing_addresses?.filter(a => a._id !== id);
  };

  const handleSetPrimaryAddress = async (id: string) => {
    const addresses = currentHealthUnit?.billing_addresses;
    addresses.forEach(a => {
      if (a._id !== id) a.primary = false;
      else a.primary = true;
    });

    try {
      await fetch(`/api/health-units/${currentHealthUnit?._id}`, {
        method: 'PUT',
        body: JSON.stringify({ billing_addresses: addresses }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar('Changed primary address successfuly.');
      fetchHealthUnitInfo();
    } catch (error) {
      enqueueSnackbar('Something went wrong, try again.', {
        variant: 'error',
      });
      fetchHealthUnitInfo();
    }
  };

  const handleAddNewAccount = async newAccount => {
    if (!healthUnit?.stripe_information?.account_id) {
      enqueueSnackbar(
        'You cant add a bank account if the health unit has no stripe account id associated',
        {
          variant: 'warning',
        }
      );
      return;
    }
    setIsLoadingExternalAccounts(true);
    // TODO: MAP BODY TO SEND TO BACKEND
    try {
      const getTokenBody = {
        country: 'PT',
        currency: 'eur',
        account_holder_name: newAccount.holderName,
        account_holder_type: 'company',
        account_number: newAccount.accountNumber,
      };

      const getTokenResponse = await fetch('/api/payments/tokens/bank', {
        method: 'POST',
        body: JSON.stringify(getTokenBody),
      });

      const token = getTokenResponse.id;

      const accountCreated = await fetch(
        `/api/health-units/${currentHealthUnit?._id}/external-accounts`,
        {
          method: 'POST',
          body: JSON.stringify({ external_account_token: token }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (newAccount.primary) {
        await fetch(`/api/health-units/${currentHealthUnit?._id}/external-accounts/default`, {
          method: 'POST',
          body: JSON.stringify({ external_account_id: accountCreated.id }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      enqueueSnackbar('New Bank account added successfuly.');
      fetchHealthUnitExternalAccounts();
    } catch (error) {
      enqueueSnackbar('Something went wrong, try again.', {
        variant: 'error',
      });
      setIsLoadingExternalAccounts(false);
    }
  };

  const handleSetprimaryAccount = async (id: string) => {
    try {
      await fetch(`/api/health-units/${currentHealthUnit?._id}/external-accounts/default`, {
        method: 'POST',
        body: JSON.stringify({ external_account_id: id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar('Changed primary account successfuly.');
      fetchHealthUnitExternalAccounts();
    } catch (error) {
      console.log('eeror', error);
      enqueueSnackbar('Something went wrong, try again.', {
        variant: 'error',
      });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    setIsDeletingAccount(true);
    try {
      await fetch(`/api/health-units/${currentHealthUnit?._id}/external-accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar('Deleted account successfuly.');
    } catch (error) {
      enqueueSnackbar('Something went wrong, try again.', {
        variant: 'error',
      });
      console.log('error', error);
    }
    setIsDeletingAccount(false);
    setOpenConfirmDeleteAccountModal({ show: false, id: undefined });
    fetchHealthUnitExternalAccounts();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div style={{ position: 'relative' }}>
        <PromptPopup
          open={openConfirmDeleteModal.show}
          onClose={() => setOpenConfirmDeleteModal({ show: false, id: undefined })}
          onConfirm={() => handleDeleteAddress(openConfirmDeleteModal.id)}
          text="Are you sure you want to delete this Billing Address?
          This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isSubmitting={isDeleting}
        />
        <PromptPopup
          open={openConfirmDeleteAccountModal.show}
          onClose={() => setOpenConfirmDeleteAccountModal({ show: false, id: undefined })}
          onConfirm={() => {
            if (handleDeleteAccount)
              handleDeleteAccount(openConfirmDeleteAccountModal?.id as string);
          }}
          text="Are you sure you want to delete this Bank Account?
          This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isSubmitting={isDeletingAccount}
        />
        {!isNew && (
          <MuiTooltip
            title={
              currentHealthUnit?.stripe_account?.requirements?.currently_due?.length > 0 ||
              !currentHealthUnit?.stripe_information?.account_id
                ? "Stripe account is restricted. Health Unit can't receive payments. Click here to go to Stripe's account page and provide the missing information."
                : "Stripe account is enabled. Health Unit can receive payments. Click here to go to Stripe's account page."
            }
            placement="top"
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => {
              // send to stripe account page
              if (process.env.NEXT_PUBLIC_ENV === 'dev' || process.env.NEXT_PUBLIC_ENV === 'stag') {
                window.open(
                  `https://dashboard.stripe.com/test/connect/accounts/${currentHealthUnit?.stripe_information?.account_id}`,
                  '_blank'
                );
              } else {
                window.open(
                  `https://dashboard.stripe.com/connect/accounts/${currentHealthUnit?.stripe_information?.account_id}`,
                  '_blank'
                );
              }
            }}>
            <Label
              color={
                currentHealthUnit?.stripe_account?.requirements?.currently_due?.length > 0 ||
                !currentHealthUnit?.stripe_information?.account_id
                  ? 'error'
                  : 'info'
              }
              endIcon={
                currentHealthUnit?.stripe_account?.requirements?.currently_due?.length > 0 ||
                !currentHealthUnit?.stripe_information?.account_id ? (
                  <Iconify icon="fluent:prohibited-28-filled" color="main" />
                ) : (
                  <Iconify icon="fluent:checkmark-12-filled" color="main" />
                )
              }
              sx={{ position: 'absolute', top: 0, right: 25, cursor: 'pointer' }}>
              {currentHealthUnit?.stripe_account?.requirements?.currently_due?.length > 0 ||
              !currentHealthUnit?.stripe_information?.account_id
                ? 'Restricted'
                : 'Enabled'}
            </Label>
          </MuiTooltip>
        )}
      </div>

      <RHFUploadAvatar
        sx={{
          mt: 7,
        }}
        name="logo"
        maxSize={3145728}
        onDrop={handleDrop}
        helperText={
          <Typography
            variant="caption"
            sx={{
              mt: 2,
              mb: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'center',
              color: 'text.secondary',
            }}>
            Allowed *.jpeg, *.jpg, *.png, *.gif
            <br /> Max size: {fData(5045728)}
          </Typography>
        }
      />

      <Grid
        container
        spacing={0}
        sx={{
          px: 5,
        }}>
        <input type="hidden" {...register('fileChanged')} /> {/* Add this line */}
        <input type="hidden" {...register('fileChanged')} /> {/* Add this line */}
        <Box
          rowGap={3}
          columnGap={2}
          sx={{ width: '100%' }}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}>
          <Typography variant="h4">Details</Typography>
          <Typography variant="h4"></Typography>

          <RHFTextField name="name" label="Name *" InputLabelProps={{ shrink: true }} />

          <RHFTextField name="website" label="Website" InputLabelProps={{ shrink: true }} />

          <RHFTextField name="email" label="Email *" InputLabelProps={{ shrink: true }} />

          <RHFPhoneField
            name="phoneNumber"
            label="Phone *"
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
            label="Services ***"
            InputLabelProps={{ shrink: true }}
            aria-multiline="false"
            multiple
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
            label="About ***"
            multiline
            minRows={6}
            InputLabelProps={{ shrink: true }}
          />

          <RHFTextField label="Facebook" name="facebook" InputLabelProps={{ shrink: true }} />

          <RHFTextField label="LinkedIn" name="linkedin" InputLabelProps={{ shrink: true }} />

          <RHFTextField label="Instagram" name="instagram" InputLabelProps={{ shrink: true }} />

          <RHFTextField label="Twitter" name="twitter" InputLabelProps={{ shrink: true }} />

          <RHFSelect native name="type" label="Type *" InputLabelProps={{ shrink: true }}>
            <option value="" />
            {healthUnitTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </RHFSelect>
          <Typography variant="h4"></Typography>

          {!isNew && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              sx={{ gridColumn: 'span 2' }}>
              <RHFCheckbox name="isActive" label="Active" />
              <Tooltip
                placement="right"
                text="If you mark this health unit as active, it will be visible to the public. If you mark it as inactive, it will not be visible to the public. Please make sure you know what you are doing."
                sx={{ position: 'flex', left: '-20px' }}
              />
            </Stack>
          )}

          <Typography variant="h4" sx={{ mt: 10 }}>
            Service Area ***
          </Typography>
          <Typography variant="h4"></Typography>

          <DrawableMap
            setServiceArea={value => {
              setServiceArea(value);
              setCustomIsDirty(true);
            }}
            serviceArea={serviceArea}
          />

          <Typography variant="h4" sx={{ pt: 5 }}>
            Pricing{' '}
          </Typography>
          <Typography variant="h4"></Typography>

          <RHFTextField
            label="Minimum Hourly Price ***"
            name="minimumHourlyPrice"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled={isView || isScreening}' }}>
                    €/hour
                  </Box>
                </InputAdornment>
              ),
              type: 'number',
            }}
          />

          <RHFTextField
            label="Minimum Monthly Price"
            name="minimumMonthlyPrice"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled={isView || isScreening}' }}>
                    €/month
                  </Box>
                </InputAdornment>
              ),
              type: 'number',
            }}
          />

          <RHFTextField
            label="Average Hourly Price"
            name="averageHourlyPrice"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled={isView || isScreening}' }}>
                    €/hour
                  </Box>
                </InputAdornment>
              ),
              type: 'number',
            }}
          />

          <RHFTextField
            label="Average Monthly Price"
            name="averageMonthlyPrice"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled={isView || isScreening}' }}>
                    €/month
                  </Box>
                </InputAdornment>
              ),
              type: 'number',
            }}
          />

          <Typography variant="h4" sx={{ pt: 5 }}>
            Director
          </Typography>
          <Typography variant="h4"></Typography>

          <RHFTextField name="directorName" label="Name **" InputLabelProps={{ shrink: true }} />

          <RHFTextField
            name="directorSurname"
            label="Surname **"
            InputLabelProps={{ shrink: true }}
          />

          <RHFTextField name="directorEmail" label="Email **" InputLabelProps={{ shrink: true }} />

          <RHFPhoneField
            name="directorPhone"
            label="Phone **"
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
                setValue('directorPhone', newValue);
                return;
              }

              // Limit the phone to 16 digits. (eg: +351 912 345 678 -> 16 digits)
              if (value.length > 16) {
                return;
              }

              setValue('directorPhone', value);
            }}
          />

          <RHFTextField name="directorRole" label="Role **" InputLabelProps={{ shrink: true }} />

          <Controller
            name="directorBirthdate"
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                format="dd-MM-yyyy"
                label="Birthdate **"
                maxDate={new Date()}
                minDate={new Date('01-01-1900')}
                slotProps={{
                  textField: {
                    helperText: error?.message,
                    error: !!error?.message,
                  },
                }}
                {...field}
                value={new Date(field.value)}
              />
            )}
          />

          <RHFTextField
            name="directorStreet"
            label="Street **"
            InputLabelProps={{ shrink: true }}
          />
          <RHFTextField
            InputLabelProps={{ shrink: true }}
            name="directorPostalCode"
            label="Postal Code **"
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
                    'directorPostalCode',
                    `${value[0]}${value[1]}${value[2]}${value[3]}-${value[4]}`
                  );
                  return;
                }

                // Do not allow the zip code to have more than 8 digits (XXXX-XXX -> 8 digits)
                if (value.length > 8) {
                  return;
                }
              }

              setValue('directorPostalCode', value);
            }}
          />

          <RHFTextField name="directorCity" label="City **" InputLabelProps={{ shrink: true }} />

          <RHFSelect
            native
            name="directorCountry"
            label="Country **"
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
            label="Legal Name **"
            InputLabelProps={{ shrink: true }}
          />

          <RHFTextField name="taxNumber" label="Tax Number *" InputLabelProps={{ shrink: true }} />

          <RHFTextField
            name="businessStructure"
            label="Business Structure"
            InputLabelProps={{ shrink: true }}
          />
          <RHFTextField name="street" label="Street **" InputLabelProps={{ shrink: true }} />
          <RHFTextField
            InputLabelProps={{ shrink: true }}
            name="postal_code"
            label="Postal Code **"
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

          <RHFTextField name="city" label="City **" InputLabelProps={{ shrink: true }} />

          <RHFSelect native name="country" label="Country *" InputLabelProps={{ shrink: true }}>
            <option value="" />
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </RHFSelect>
          <Typography variant="h4"></Typography>

          <Typography variant="h4"></Typography>
        </Box>
        <Box sx={{ width: '100%', pt: 5 }}>
          <HealthUnitBillingAddresses
            isLoading={isFetchingHealthUnit}
            addressBook={currentHealthUnit?.billing_addresses}
            onDeleteAddress={id => {
              const isPrimaryAddress = currentHealthUnit?.billing_addresses?.find(
                a => a._id === id
              ).primary;
              // Prevent deleting primary address
              if (isPrimaryAddress) {
                enqueueSnackbar('Delete primary address is not allowed.', {
                  variant: 'error',
                });
                return;
              }
              setOpenConfirmDeleteModal({ show: true, id });
            }}
            handleAddNewAddress={handleAddNewAddress}
            handleUpdateAddress={handleUpdateAddress}
            onSetPrimaryAddress={handleSetPrimaryAddress}
            legalInformation={{
              legalName: currentHealthUnit?.legal_information.name || '',
              taxNumber: currentHealthUnit?.legal_information.tax_number || '',
            }}
          />
        </Box>
        <Box sx={{ width: '100%', pt: 5 }}>
          <HealthUnitBankAccounts
            hasAccountId={healthUnit?.stripe_information?.account_id}
            isLoading={isLoadingExternalAccounts}
            handleAddNewAccount={handleAddNewAccount}
            onSetPrimaryAccount={handleSetprimaryAccount}
            onDeleteAccount={(id: string) => {
              const isPrimaryAddress = healthUnitExternalAccounts?.find(
                a => a.id === id
              ).default_for_currency;
              // Prevent deleting primary address
              if (isPrimaryAddress) {
                enqueueSnackbar('Delete primary account is not allowed.', {
                  variant: 'error',
                });
                return;
              }
              setOpenConfirmDeleteAccountModal({ show: true, id });
            }}
            bankAccounts={healthUnitExternalAccounts}
          />
        </Box>
        <Box sx={{ pt: 5 }}>
          <Typography
            sx={{ fontSize: '12px', color: '#91A0AD', marginTop: '10px', marginLeft: '5px' }}>
            * Required field
          </Typography>

          <Typography
            sx={{ fontSize: '12px', color: '#91A0AD', marginTop: '10px', marginLeft: '5px' }}>
            ** Required field for Stripe account
          </Typography>

          <Typography
            sx={{ fontSize: '12px', color: '#91A0AD', marginTop: '10px', marginLeft: '5px' }}>
            *** Required field for active status
          </Typography>
        </Box>
      </Grid>

      <Stack alignItems="flex-end" sx={{ mt: 2, mb: 5, mr: 5 }}>
        <LoadingButton
          variant="contained"
          loading={isSubmitting}
          disabled={!isDirty && !customIsDirty}
          onClick={handleSubmit(onSubmit)}>
          {isNew ? 'Add' : 'Save'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
