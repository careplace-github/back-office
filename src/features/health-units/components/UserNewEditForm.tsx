import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseISO } from 'date-fns';
// next
import { useRouter } from 'next/router';
import NextLink from 'next/link';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
} from '@mui/material';
// utils
import { fData } from 'src/utils/formatNumber';
// assets
import { countries, collaboratorRoles, genders } from 'src/data';
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
  editUser: PropTypes.object,
  services: PropTypes.array,
  user: PropTypes.object,
  healthUnitId: PropTypes.string,
};

export default function UserNewEditForm({
  isNew = false,
  isEdit = false,
  isView = false,
  editUser,
  services,
  healthUnitId,
}) {
  const { push } = useRouter();

  const { data: user } = useSession();

  const [isCaregiver, setIsCaregiver] = useState(editUser?.role === 'caregiver');
  const [showPermissions, setShowPermissions] = useState(
    editUser?.permissions?.includes('app_user') || false
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
      firstName: editUser?.name ? editUser.name.split(' ')[0] : '',
      lastName: editUser?.name ? editUser.name.split(' ').pop() : '',
      gender: editUser?.gender || '',

      email: editUser?.email || '',
      phoneNumber: editUser?.phone || '',

      street: editUser?.address?.street || '',
      postal_code: editUser?.address?.postal_code || '',
      city: editUser?.address?.city || '',
      state: editUser?.address?.state || '',
      country: editUser?.address?.country || '',

      services: editUser?.services || [],

      birthdate: editUser?.birthdate ? editUser?.birthdate : '',

      profile_picture: editUser?.profile_picture || '',
      isVerified: editUser?.isVerified || true,
      status: editUser?.status,
      role: editUser?.role || '',

      fileChanged: '',

      // Permissions
      permissions: editUser?.permissions || [],
      app_user: editUser?.permissions?.includes('app_user') || false,

      admin_edit_users_permissions:
        editUser?.permissions?.includes('admin_edit_users_permissions') || false,
      // admin_edit_company: editUser?.permissions?.includes('admin_edit_company') || false,
      dashboard_view: editUser?.permissions?.includes('dashboard_view') || false,
      calendar_view: editUser?.permissions?.includes('calendar_view') || false,
      calendar_edit: editUser?.permissions?.includes('calendar_edit') || false,
      orders_view: editUser?.permissions?.includes('orders_view') || false,
      orders_edit: editUser?.permissions?.includes('orders_edit') || false,
      orders_emails: editUser?.permissions?.includes('orders_emails') || false,
      orders_email: editUser?.permissions?.includes('orders_email') || false,
      users_view: editUser?.permissions?.includes('users_view') || false,
      users_edit: editUser?.permissions?.includes('users_edit') || false,
    }),

    [editUser]
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
    // ----------- Permissions ------------ //
    console.log('entered on Submit', data);
    const permissions: string[] = [];

    // Add the permissions to the array
    if (getValues('app_user')) {
      permissions.push('app_user');
    }
    // Remove the permissions from the array
    else {
      permissions.splice(permissions.indexOf('app_user'), 1);
    }

    if (getValues('admin_edit_users_permissions')) {
      permissions.push('admin_edit_users_permissions');
    } else {
      permissions.splice(permissions.indexOf('admin_edit_users_permissions'), 1);
    }

    if (getValues('dashboard_view')) {
      permissions.push('dashboard_view');
    } else {
      permissions.splice(permissions.indexOf('dashboard_view'), 1);
    }

    if (getValues('calendar_view')) {
      permissions.push('calendar_view');
    } else {
      permissions.splice(permissions.indexOf('calendar_view'), 1);
    }

    if (getValues('calendar_edit')) {
      permissions.push('calendar_edit');
    } else {
      permissions.splice(permissions.indexOf('calendar_edit'), 1);
    }

    if (getValues('orders_view')) {
      permissions.push('orders_view');
    } else {
      permissions.splice(permissions.indexOf('orders_view'), 1);
    }

    if (getValues('orders_edit')) {
      permissions.push('orders_edit');
    } else {
      permissions.splice(permissions.indexOf('orders_edit'), 1);
    }

    if (getValues('orders_emails')) {
      permissions.push('orders_emails');
    } else {
      permissions.splice(permissions.indexOf('orders_emails'), 1);
    }

    if (getValues('users_view')) {
      permissions.push('users_view');
    } else {
      permissions.splice(permissions.indexOf('users_view'), 1);
    }

    if (getValues('users_edit')) {
      permissions.push('users_edit');
    } else {
      permissions.splice(permissions.indexOf('users_edit'), 1);
    }

    // ------------------------------ //

    const _user = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phoneNumber,
      birthdate: data.birthdate,
      gender: data.gender,
      address: {
        street: data.street,
        postal_code: data.postal_code,
        city: data.city,
        state: data.state,
        country: data.country,
      },
      role: data.role,
      company: data.company,
      permissions,
      ...(data.role === 'caregiver' && { services: data.services }),
    };

    console.log('user:', _user);

    let response;

    try {
      if (_user.role === 'caregiver') {
        response = await fetch(`/api/health-units/${healthUnitId}/caregivers`, {
          method: 'POST',
          body: JSON.stringify(_user),
        });
      } else {
        response = await fetch(`/api/health-units/${healthUnitId}/collaborators`, {
          method: 'POST',
          body: JSON.stringify(_user),
        });
      }

      if (response.error) {
        throw new Error(response.statusText);
      }
      enqueueSnackbar('Colaborador adicionado com sucesso!');
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

        setValue('profile_picture', newFile.preview, { shouldDirty: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} sx={{ padding: '24px' }}>
        <Grid item xs={12}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}>
            <Typography sx={{ gridColumn: 'span 2' }} variant="h4">
              Add Collaborator
            </Typography>

            {/* {isView && user?.permissions?.includes('users_edit') && (
              <Stack alignItems="flex-end" sx={{ mb: 3 }}>
                <NextLink href={PATHS.users.edit(editUser._id)} passHref>
                  <Button variant="contained">Editar</Button>
                </NextLink>
              </Stack>
            )} */}

            {/* {isEdit && <Typography variant="h4"></Typography>}

            {isNew && <Typography variant="h4"></Typography>} */}

            {/* {isView && !user?.permissions?.includes('users_edit') && (
              <Typography variant="h4"></Typography>
            )} */}

            <RHFTextField
              name="firstName"
              label="Name *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="lastName"
              label="Last Name *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="email"
              label="Email *"
              disabled={isView || editUser?.permissions?.includes('app_user')}
              InputLabelProps={{ shrink: true }}
            />

            <RHFPhoneField
              disabled={isView}
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

            <Controller
              name="birthdate"
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  format="dd-MM-yyyy"
                  label="Birthdate *"
                  maxDate={new Date()}
                  disabled={isView}
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

            <RHFSelect
              native
              name="gender"
              label="Gender *"
              disabled={isView}
              InputLabelProps={{ shrink: true }}>
              {genders.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>

            <RHFTextField
              name="street"
              label="Street"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
              disabled={isView}
              InputLabelProps={{ shrink: true }}
              name="postal_code"
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
              name="city"
              label="City"
              disabled={isView}
              InputLabelProps={{ shrink: true }}
            />

            <RHFSelect
              native
              name="country"
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

            <RHFSelect
              native
              name="role"
              label="Role *"
              InputLabelProps={{ shrink: true }}
              disabled={isView}
              onChange={e => {
                setValue('role', e.target.value);
                setIsCaregiver(e.target.value === 'caregiver');
              }}>
              <option value="" />
              {collaboratorRoles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </RHFSelect>

            <Stack
              direction="row"
              sx={{
                width: '100%',
              }}>
              {isCaregiver && (
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
              )}
            </Stack>

            <Typography
              sx={{ fontSize: '12px', color: '#91A0AD', marginTop: '10px', marginLeft: '5px' }}>
              * Field Required
            </Typography>

            <Typography variant="h4"></Typography>

            <Typography variant="h4" sx={{ mt: 5, gridColumn: 'span 2' }}>
              Permissions
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              sx={{ gridColumn: 'span 2' }}>
              <RHFSwitch
                name="app_user"
                label="Grant access to Careplace Bussiness"
                /**
                 * If one wants to remove user's access to the platform, he must delete the user and create a new one.
                 * This is just for the MVP.
                 *
                 *  @todo implement rest api feature to delete the user only from the authentication provider
                 */
                disabled={isView || editUser?.permissions?.includes('app_user')}
                onClick={() => {
                  if (!isView && !editUser?.permissions?.includes('app_user')) {
                    setShowPermissions(!showPermissions);
                  }
                }}
              />
              <Tooltip
                placement="right"
                text="Allows the user to access Careplace Business platform. If you want to remove user's access, you should delete this user and create a new one. You can only create a user with an email that contains the company's domain."
                sx={{ position: 'flex', left: '-90px' }}
              />
            </Stack>
            {showPermissions && (
              <>
                <Typography variant="subtitle1" sx={{ gridColumn: 'span 2' }}>
                  Admin
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ gridColumn: 'span 2' }}>
                  <RHFCheckbox
                    name="admin_edit_users_permissions"
                    label="Edit other user's information"
                    disabled={isView}
                  />
                  <Tooltip
                    placement="right"
                    text="Allows the user to edit other user's permissions."
                  />
                </Stack>
                <Typography variant="subtitle1" sx={{ gridColumn: 'span 2' }}>
                  Dashboard
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ gridColumn: 'span 2' }}>
                  <RHFCheckbox
                    name="dashboard_view"
                    label="See"
                    disabled={isView}
                    sx={{ '& > label': { backgroundColor: 'red' } }}
                  />

                  <Tooltip placement="right" text="Allows the user to see Dashboard page." />
                </Stack>

                <Typography variant="subtitle1" sx={{ gridColumn: 'span 2' }}>
                  Calendar
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RHFCheckbox name="calendar_view" label="See" disabled={isView} />
                  <Tooltip
                    placement="right"
                    text="Allows the user to see the order events of the company."
                    sx={{ position: 'relative', left: '-20px' }}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RHFCheckbox name="calendar_edit" label="Edit" disabled={isView} />
                  <Tooltip
                    placement="right"
                    text="Allows the user to edit information related to company order events."
                    sx={{ position: 'relative', left: '-20px' }}
                  />
                </Stack>

                <Typography variant="subtitle1" sx={{ gridColumn: 'span 2' }}>
                  Orders
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RHFCheckbox name="orders_view" label="See" disabled={isView} />
                  <Tooltip
                    placement="right"
                    text="Allows the user to see all the company orders."
                    sx={{ position: 'relative', left: '-20px' }}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RHFCheckbox name="orders_edit" label="Edit" disabled={isView} />
                  <Tooltip
                    placement="right"
                    text="Allows the iser to edit information related to the company orders, use order actions (ex: accept order, schedule order, send budget, etc)."
                    sx={{ position: 'relative', left: '-20px' }}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RHFCheckbox name="orders_emails" label="Receive Emails" disabled={isView} />
                  <Tooltip
                    placement="right"
                    text="Allows the user to receive emails related to orders."
                    sx={{ position: 'relative', left: '-20px', gridColumn: 'span 2' }}
                  />
                </Stack>

                <Typography variant="subtitle1" sx={{ gridColumn: 'span 2' }}>
                  Team
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <RHFCheckbox name="users_view" label="See" disabled={isView} />
                  <Tooltip
                    placement="right"
                    text="Allows user to see company collabborators."
                    sx={{ position: 'relative', left: '-20px' }}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RHFCheckbox name="users_edit" label="Edit" disabled={isView} />
                  <Tooltip
                    placement="right"
                    text="Allows the user to edit information related to company collaborators."
                    sx={{ position: 'relative', left: '-20px' }}
                  />
                </Stack>
              </>
            )}
          </Box>

          {!isView && (
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                // type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isDirty}
                onClick={() => {
                  onSubmit(getValues());
                  console.log('hello');
                  // handleSubmit(onSubmit);
                }}>
                {/* {!isEdit ? 'Adicionar' : 'Guardar'} */}
                Add
              </LoadingButton>
            </Stack>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  );
}
