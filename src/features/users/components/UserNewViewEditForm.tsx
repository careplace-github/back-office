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
  editUser: PropTypes.object,
  services: PropTypes.array,
  user: PropTypes.object,
};

export default function UserNewEditForm({
  isNew = false,
  isEdit = false,
  isView = false,
  editUser,
  services,
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

    // ----------- Permissions ------------ //

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
      profile_picture: data.fileChanged ? fileURL : data.profile_picture,
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

    if (isEdit) {
      let response;

      try {
        if (_user.role === 'caregiver') {
          response = await fetch(`/api/caregivers/${editUser._id}`, {
            method: 'PUT',
            body: JSON.stringify(_user),
          });
        } else {
          response = await fetch(`/api/collaborators/${editUser._id}`, {
            method: 'PUT',
            body: JSON.stringify(_user),
          });
        }

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
        if (_user.role === 'caregiver') {
          response = await fetch('/api/caregivers', {
            method: 'POST',
            body: JSON.stringify(_user),
          });
        } else {
          response = await fetch('/api/collaborators', {
            method: 'POST',
            body: JSON.stringify(_user),
          });
        }

        if (response.error) {
          throw new Error(response.statusText);
        }
        enqueueSnackbar('Colaborador adicionado com sucesso!');

        window.location.href = PATHS.users.root;
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

        setValue('profile_picture', newFile.preview, { shouldDirty: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                disabled={isView}
                name="profile_picture"
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
                    <br /> tamanho máximo de {fData(5045728)}
                  </Typography>
                }
              />
              <input type="hidden" {...register('fileChanged')} /> {/* Add this line */}
            </Box>
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
              <Typography variant="h4">Detalhes</Typography>

              {isView && user?.permissions?.includes('users_edit') && (
                <Stack alignItems="flex-end" sx={{ mb: 3 }}>
                  <NextLink href={PATHS.users.edit(editUser._id)} passHref>
                    <Button variant="contained">Editar</Button>
                  </NextLink>
                </Stack>
              )}

              {isEdit && <Typography variant="h4"></Typography>}

              {isNew && <Typography variant="h4"></Typography>}

              {isView && !user?.permissions?.includes('users_edit') && (
                <Typography variant="h4"></Typography>
              )}

              <RHFTextField
                name="firstName"
                label="Nome *"
                disabled={isView}
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="lastName"
                label="Apelido *"
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

              <Controller
                name="birthdate"
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    format="dd-MM-yyyy"
                    label="Data de Nascimento *"
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
                label="Género *"
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

              <RHFSelect
                native
                name="role"
                label="Cargo *"
                InputLabelProps={{ shrink: true }}
                disabled={isView}
                onChange={e => {
                  setValue('role', e.target.value);
                  setIsCaregiver(e.target.value === 'caregiver');
                }}>
                <option value="" />
                {roles.map(role => (
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
                    label="Serviços *"
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
                * Campo obrigatório
              </Typography>

              <Typography variant="h4"></Typography>

              {user?.permissions?.includes('admin_edit_users_permissions') &&
                methods.getValues('role') !== 'caregiver' && (
                  <>
                    <Typography variant="h4" sx={{ mt: 5 }}>
                      Permissões
                    </Typography>
                    <Typography variant="h3"> </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      sx={{ gridColumn: 'span 2' }}>
                      <RHFSwitch
                        name="app_user"
                        label="Conceder acesso à plataforma Careplace Business"
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
                        text="Permite ao utilizador aceder à plataforma Careplace Business. Se pretender remover o acesso do utilizador à plataforma, deverá apagar o utilizador e criar um novo.
                        Só poderá criar um utilizador com acesso à plataforma se o email do utilizador for do mesmo domínio da empresa."
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
                            label="Editar permissões de outros utilizadores"
                            disabled={isView}
                          />
                          <Tooltip
                            placement="right"
                            text="Permite ao utilizador editar as permissões de outros utilizadores."
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
                            label="Ver"
                            disabled={isView}
                            sx={{ '& > label': { backgroundColor: 'red' } }}
                          />

                          <Tooltip
                            placement="right"
                            text='Permite ao utilizador ver a página "Dashboard".'
                          />
                        </Stack>

                        <Typography variant="subtitle1">Agendamentos</Typography>
                        <Typography variant="subtitle2"> </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <RHFCheckbox name="calendar_view" label="Ver" disabled={isView} />
                          <Tooltip
                            placement="right"
                            text="Permite ao utilizador ver os eventos referentes aos pedidos da empresa."
                            sx={{ position: 'relative', left: '-20px' }}
                          />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <RHFCheckbox name="calendar_edit" label="Editar" disabled={isView} />
                          <Tooltip
                            placement="right"
                            text="Permite ao utilizador editar as informações dos eventos referentes aos pedidos da empresa."
                            sx={{ position: 'relative', left: '-20px' }}
                          />
                        </Stack>

                        <Typography variant="subtitle1">Pedidos</Typography>
                        <Typography variant="subtitle2"> </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <RHFCheckbox name="orders_view" label="Ver" disabled={isView} />
                          <Tooltip
                            placement="right"
                            text="Permite ao utilizador ver os pedidos da empresa."
                            sx={{ position: 'relative', left: '-20px' }}
                          />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <RHFCheckbox name="orders_edit" label="Editar" disabled={isView} />
                          <Tooltip
                            placement="right"
                            text="Permite ao utilizador editar as informações dos pedidos da empresa, bem como utilizar as ações do pedido (aceitar um pedido, agendar visitas, enviar orçamentos, etc)."
                            sx={{ position: 'relative', left: '-20px' }}
                          />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <RHFCheckbox
                            name="orders_emails"
                            label="Receber Emails"
                            disabled={isView}
                          />
                          <Tooltip
                            placement="right"
                            text="Permite ao utilizador receber emails transacionais referentes aos pedidos da empresa (quando a empresa recebe um novo pedido, quando o utilizador efetua um pagamento, etc)."
                            sx={{ position: 'relative', left: '-20px' }}
                          />
                        </Stack>
                        <Typography variant="subtitle2"> </Typography>

                        <Typography variant="subtitle1">Equipa</Typography>
                        <Typography variant="subtitle2"> </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <RHFCheckbox name="users_view" label="Ver" disabled={isView} />
                          <Tooltip
                            placement="right"
                            text="Permite ao utilizador ver os colaboradores da empresa."
                            sx={{ position: 'relative', left: '-20px' }}
                          />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <RHFCheckbox name="users_edit" label="Editar" disabled={isView} />
                          <Tooltip
                            placement="right"
                            text="Permite ao utilizador editar as informações dos colaboradores da empresa. Nota: não permite editar as permissões dos colaboradores."
                            sx={{ position: 'relative', left: '-20px' }}
                          />
                        </Stack>
                      </>
                    )}
                  </>
                )}
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
      </Grid>
    </FormProvider>
  );
}
