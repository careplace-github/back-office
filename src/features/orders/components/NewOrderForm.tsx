import * as Yup from 'yup';
import React, { useEffect, useMemo, useState, ReactNode } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  Divider,
  Box,
  Button,
  Collapse,
  Tooltip,
  SelectChangeEvent,
} from '@mui/material';
// routes
import { PATHS } from 'src/routes';
import { useRouter } from 'next/router';
// Date Pickers
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
// data
import { genders, countries } from 'src/data';
import { WEEK_DAYS_OPTIONS, RECURRENCY_OPTIONS } from 'src/data/orders';
// components
import AvatarAutocomplete from 'src/components/avatar-autocomplete/AvatarAutocomplete';
import AvatarDropdown from 'src/components/avatar-dropdown';
import { useSnackbar } from 'src/components/snackbar';
import ConfirmDialog from 'src/components/confirm-dialog';

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFPhoneField,
  RHFAutocomplete,
} from 'src/components/hook-form';
// utils
import { fDate } from 'src/utils/formatTime';
// lib
import fetch from 'src/lib/fetch';
// types
import { IServiceProps } from 'src/types';
import { IScheduleProps } from 'src/types/order';
import { ICaregiverProps } from 'src/types/caregiver';

// ----------------------------------------------------------------------

type Props = {
  isScreening?: boolean;
  isView?: boolean;
  isEdit?: boolean;
  services: IServiceProps[];
  caregivers: any;
  customers: any;
  patients: any;
};

export default function NewOrderForm({
  isScreening = false,
  isView = false,
  isEdit = false,
  services = [],
  caregivers,
  customers,
  patients,
}: Props) {
  const { push } = useRouter();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [openAddNewPatient, setOpenAddNewPatient] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [openAddNewCustomer, setOpenAddNewCustomer] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<any>();
  const [customerInfoValid, setCustomerInfoValid] = useState<boolean>(false);
  const [patientInfoValid, setPatientInfoValid] = useState<boolean>(false);
  const [orderInfoValid, setOrderInfoValid] = useState<boolean>(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any>();
  const [selectedCaregiver, setSelectedCaregiver] = useState<ICaregiverProps>();

  const NewProductSchema = Yup.object().shape({
    // name: Yup.string().required('Insira um nome'),
    quote: Yup.number().moreThan(0, 'Insira um valor'),
    orderStart: Yup.string().required('Insira uma data de início'),
  });

  const handleChangeSelectedCaregiver: (
    event: SelectChangeEvent<string>,
    child: ReactNode
  ) => void = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    const caregiver = value as string;

    setSelectedCaregiver(JSON.parse(caregiver));
  };

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      images: [],
      code: '',
      sku: '',
      price: 0,
      quote: 0,
      tags: [],
      inStock: true,
      taxes: true,
      gender: '',
      category: '',
      screeningVisit: '',

      caregiver: '',
      orderStart: '',
      recurrency: '',
      services: [],

      week_days: [],

      // ----------------------------

      // ---------- PATIENT ----------

      patientFirstName: '',
      patientLastName: '',
      patientPhone: '',
      patientBirthDate: '',
      patientGender: '',
      patientStreet: '',
      patientPostalCode: '',
      patientCity: '',
      patientCountry: '',
      patientMedicalConditions: '',

      // ---------- CUSTOMER ----------

      customerFirstName: '',
      customerLastName: '',
      customerPhone: '',
      customerEmail: '',
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [filterWeekdays, setFilterWeekdays] = useState<IScheduleProps[]>([]);
  const [disableCreateOrderButton, setDisableCreateOrderButton] = useState<boolean>(true);

  function addOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }
  function removeOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
  }

  const methods = useForm({
    mode: 'onBlur',
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { isValid },
  } = methods;

  // order info
  const quote = watch('quote');
  const orderStart = watch('orderStart');
  const recurrency = watch('recurrency');
  const servicesSelected = watch('services');

  // Patient info
  const patientFirstName = watch('patientFirstName');
  const patientLastName = watch('patientLastName');
  const patientPhone = watch('patientPhone');
  const patientBirthDate = watch('patientBirthDate');
  const patientGender = watch('patientGender');
  const patientStreet = watch('patientStreet');
  const patientPostalCode = watch('patientPostalCode');
  const patientCity = watch('patientCity');
  const patientCountry = watch('patientCountry');
  const patientMedicalConditions = watch('patientMedicalConditions');

  // Customer Info
  const customerFirstName = watch('customerFirstName');
  const customerLastName = watch('customerLastName');
  const customerPhone = watch('customerPhone');
  const customerEmail = watch('customerEmail');
  // Order quote
  const orderQuote = watch('quote');
  // Order start date
  const orderStartValue = watch('orderStart');

  useEffect(() => {
    const isElementValid = value => {
      if (!value || value === '') return false;
      return true;
    };
    // check if order info is valid
    const isFilterWeekdaysValid = schedule => {
      let valid = true;
      schedule.forEach(item => {
        if (!item.week_day || !item.start || !item.end) valid = false;
      });
      return valid;
    };
    setOrderInfoValid(
      quote > 0 &&
        isElementValid(orderStart) &&
        isElementValid(recurrency) &&
        servicesSelected.length > 0 &&
        isFilterWeekdaysValid(filterWeekdays)
    );
    // check if costumer info is valid
    if (!openAddNewCustomer) {
      setCustomerInfoValid(!!selectedCustomer);
    } else {
      setCustomerInfoValid(
        isElementValid(customerFirstName) &&
          isElementValid(customerLastName) &&
          isElementValid(customerPhone) &&
          isElementValid(customerEmail)
      );
    }
    // check if patient info is valid
    if (!openAddNewPatient) {
      setPatientInfoValid(!!selectedPatient);
    } else {
      setPatientInfoValid(
        isElementValid(patientFirstName) &&
          isElementValid(patientLastName) &&
          isElementValid(patientPhone) &&
          isElementValid(patientBirthDate) &&
          isElementValid(patientGender) &&
          isElementValid(patientStreet) &&
          isElementValid(patientPostalCode) &&
          isElementValid(patientCity) &&
          isElementValid(patientCountry)
      );
    }
  }, [
    quote,
    orderStart,
    servicesSelected,
    recurrency,
    patientFirstName,
    patientLastName,
    patientPhone,
    patientBirthDate,
    patientGender,
    patientStreet,
    patientPostalCode,
    patientCity,
    patientCountry,
    patientMedicalConditions,
    customerFirstName,
    customerLastName,
    customerPhone,
    customerEmail,
    orderQuote,
    filterWeekdays,
    orderStartValue,
    openAddNewCustomer,
    openAddNewPatient,
    selectedPatient,
    selectedCustomer,
  ]);

  const [openQuote, setOpenQuote] = useState(false);

  const onSendQuote = () => {
    setOpenQuote(false);
    enqueueSnackbar('Orçamento Enviado!');
    push(PATHS.orders.root);
  };

  const handleCloseQuote = () => {
    setOpenQuote(false);
  };

  // ----------------------------

  const [openScreeningVisit, setOpenScreeningVisit] = useState(false);

  const onSendScreeningVisit = () => {
    setOpenScreeningVisit(false);
    enqueueSnackbar('Visita de Avaliação Marcada com Sucesso!');
    push(PATHS.orders.root);
  };

  const handleCloseScreeningVisit = () => {
    setOpenScreeningVisit(false);
  };

  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    let newCustomerId = null;
    let newPatientId = null;
    if (openAddNewPatient) {
      const createPatientPayload = {
        name: `${patientFirstName.replaceAll(' ', '')} ${patientLastName.replaceAll(' ', '')}`,
        phone: patientPhone,
        address: {
          street: patientStreet,
          postal_code: patientPostalCode,
          city: patientCity,
          country: patientCountry,
        },
        birthdate: patientBirthDate,
        medical_conditions: patientMedicalConditions,
      };
      const newPatient = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPatientPayload),
      });
      newPatientId = newPatient?._id;
    }
    if (openAddNewCustomer) {
      // TODO: create a user before create the order
      const createCustomerPayload = {
        name: `${customerFirstName.replaceAll(' ', '')} ${customerLastName.replaceAll(' ', '')}`,
        email: customerEmail,
        phone: customerPhone,
      };
      const newCustomer = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createCustomerPayload),
      });
      newCustomerId = newCustomer?._id;
    }
    const payloadToSend = {
      patient: newPatientId || selectedPatient?._id,
      customer: newCustomerId || selectedCustomer?._id,
      caregiver: selectedCaregiver?._id,
      services: servicesSelected,
      schedule_information: {
        start_date: orderStart,
        isRecurrent: parseInt(recurrency, 10) !== 0,
        recurrency,
        schedule: filterWeekdays,
      },
    };
    try {
      await fetch('/api/orders/home-care/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToSend),
      });
      router.push(PATHS.orders.root);
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  // check if is valid
  useEffect(() => {
    if (patientInfoValid && customerInfoValid && !!selectedCaregiver && orderInfoValid) {
      setDisableCreateOrderButton(false);
    } else {
      setDisableCreateOrderButton(true);
    }
  }, [
    isValid,
    patientInfoValid,
    selectedCaregiver,
    customerInfoValid,
    filterWeekdays,
    orderInfoValid,
  ]);

  const clearPatientFields = () => {
    setValue('patientFirstName', '');
    setValue('patientLastName', '');
    setValue('patientPhone', '');
    setValue('patientBirthDate', '');
    setValue('patientGender', '');
    setValue('patientStreet', '');
    setValue('patientPostalCode', '');
    setValue('patientCity', '');
    setValue('patientCountry', '');
    setValue('patientMedicalConditions', '');
  };

  const clearCustomerFields = () => {
    setValue('customerFirstName', '');
    setValue('customerLastName', '');
    setValue('customerPhone', '');
    setValue('customerEmail', '');
  };

  // ----------------------------

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Informações do Pedido
              </Typography>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}>
                <RHFAutocomplete
                  name="services"
                  label="Serviços"
                  aria-multiline="false"
                  multiple
                  disabled={isView}
                  freeSolo
                  sx={{
                    width: '100%',
                    '& .MuiAutocomplete-tag': {
                      maxWidth: '190px',
                    },
                  }}
                  onChange={(event, newValue) => {
                    setValue('services', newValue as any);
                  }}
                  options={services.map(option => option._id)}
                  getOptionLabel={_id => services.find(option => option._id === _id)?.name || ''}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Tooltip arrow title={services.find(item => item._id === option)?.name || ''}>
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          size="small"
                          label={services.find(item => item._id === option)?.name || ''}
                        />
                      </Tooltip>
                    ))
                  }
                />

                <RHFAutocomplete
                  name="week_days"
                  label="Dias da Semana"
                  aria-multiline={false}
                  multiple
                  // only 1 line

                  disabled={isView}
                  freeSolo
                  onChange={(event, newValue) => {
                    // From the newValue
                    setValue('week_days', newValue as any);

                    // only do this for the values that are not already in the filterWeekdays
                    let transformData = newValue.map(item => {
                      const sch: IScheduleProps = {
                        week_day: item as number,
                        start: null,
                        end: null,
                      };
                      return sch;
                    });

                    // for the values that are already in the filterWeekdays update the values of start and end
                    transformData = transformData.map(item => {
                      const found = filterWeekdays.find(
                        sch => sch.week_day === item.week_day
                      ) as IScheduleProps;

                      if (found) {
                        item.start = found.start;
                        item.end = found.end;
                      }

                      return item;
                    });

                    const newSchedule = transformData;

                    // order the array by week_day
                    newSchedule.sort((a, b) => a.week_day - b.week_day);

                    setFilterWeekdays(newSchedule);
                  }}
                  options={WEEK_DAYS_OPTIONS.map(option => option.value)}
                  getOptionLabel={value =>
                    WEEK_DAYS_OPTIONS.find(option => option.value === value)?.label || ''
                  }
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        label={WEEK_DAYS_OPTIONS.find(item => item.value === option)?.label || ''}
                      />
                    ))
                  }
                />

                <Controller
                  name="orderStart"
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      format="dd-MM-yyyy"
                      label="Início Pretendido"
                      slotProps={{
                        textField: {
                          helperText: error?.message,
                          error: !!error?.message,
                        },
                      }}
                      {...field}
                      disabled={isView}
                      value={new Date(field.value)}
                      onChange={date => {
                        setValue('orderStart', date as any);
                      }}
                    />
                  )}
                />

                <RHFSelect native name="recurrency" label="Recorrência" disabled={isView}>
                  {RECURRENCY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>

                <RHFTextField
                  name="quote"
                  label="Orçamento"
                  disabled={isView || isScreening}
                  placeholder="0.00"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          component="span"
                          sx={{ color: 'text.disabled={isView || isScreening}' }}>
                          €
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />

                <AvatarDropdown
                  onChange={handleChangeSelectedCaregiver}
                  selected={JSON.stringify(selectedCaregiver)}
                  options={caregivers}
                  disabled={isView}
                  emptyText="Nenhum cuidador encontrado"
                  selectText="Selecione um cuidador"
                  avatarSize={30}
                />
              </Box>

              <Grid container direction="row" gap={1} sx={{ width: '100%' }}>
                {filterWeekdays.length > 0 &&
                  filterWeekdays
                    .sort((a, b) => a.week_day - b.week_day)
                    .map(item => {
                      let weekdayItem;

                      WEEK_DAYS_OPTIONS.forEach(weekday => {
                        if (weekday.value === item.week_day) {
                          weekdayItem = weekday;
                        }
                      });
                      return (
                        <Grid item xs={12} key={JSON.stringify(item)}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              flex: 1,
                            }}>
                            <Stack gap="16px" direction="row">
                              <TimePicker
                                disabled={isView}
                                ampm={false}
                                label={`${weekdayItem.label} (início)`}
                                sx={{ flex: 1, mb: 2 }}
                                onChange={date => {
                                  const newSchedule = filterWeekdays.map(schedule => {
                                    if (schedule.week_day === item.week_day) {
                                      schedule.start = date;
                                    }
                                    return schedule;
                                  });

                                  setFilterWeekdays(newSchedule);
                                }}
                                value={item.start ? new Date(item.start) : null} // And here
                              />

                              <TimePicker
                                disabled={isView}
                                skipDisabled
                                ampm={false}
                                onChange={date => {
                                  const newSchedule = filterWeekdays.map(schedule => {
                                    if (schedule.week_day === item.week_day) {
                                      schedule.end = date;
                                    }
                                    return schedule;
                                  });

                                  setFilterWeekdays(newSchedule);
                                }}
                                label={`${weekdayItem.label} (fim)`}
                                sx={{ flex: 1, mb: 2 }}
                                value={item.end ? new Date(item.end) : null} // And here
                              />
                            </Stack>
                          </Box>
                        </Grid>
                      );
                    })}
              </Grid>

              <Divider sx={{ borderStyle: 'dashed' }} />
            </Stack>

            <Stack spacing={3}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Utente
              </Typography>
              <AvatarAutocomplete
                onEditClick={() => setSelectedPatient(null)}
                disabled={openAddNewPatient}
                selectedItem={
                  selectedPatient
                    ? {
                        value: selectedPatient._id,
                        text: selectedPatient.name,
                        avatar: selectedPatient.profile_picture || null,
                      }
                    : null
                }
                label="Selecionar Utente"
                onChange={(event, newValue) => {
                  if (newValue) {
                    const foundPatient = patients.find(obj => {
                      return obj._id === newValue.value;
                    });
                    setSelectedPatient(foundPatient);
                    return;
                  }
                  setSelectedPatient(newValue);
                }}
                options={patients.map(patient => {
                  return {
                    value: patient._id,
                    text: patient.name,
                    avatar: patient.profile_picture || null,
                  };
                })}
              />
              {!selectedPatient && (
                <Stack width="100%" alignItems="flex-end" justifyContent="flex-start">
                  <Button
                    variant="text"
                    sx={{
                      color: openAddNewPatient ? 'red' : 'primary.main',
                    }}
                    onClick={() => {
                      setOpenAddNewPatient(prev => {
                        if (!prev === false) clearPatientFields();
                        return !prev;
                      });
                    }}>
                    {!openAddNewPatient ? 'Adicionar Utente' : 'Cancelar'}
                  </Button>
                </Stack>
              )}
              <Collapse in={openAddNewPatient || selectedPatient} unmountOnExit>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}>
                  <RHFTextField
                    value={selectedPatient ? selectedPatient?.name.split(' ')[0] : patientFirstName}
                    name="patientFirstName"
                    label="Nome"
                    disabled={selectedPatient}
                  />

                  <RHFTextField
                    value={selectedPatient ? selectedPatient?.name.split(' ')[1] : patientLastName}
                    name="patientLastName"
                    label="Apelido"
                    disabled={selectedPatient}
                  />

                  <RHFPhoneField
                    value={selectedPatient ? selectedPatient?.phone : patientPhone}
                    name="patientPhone"
                    label="Telefone"
                    defaultCountry="PT"
                    forceCallingCode
                    disabled={selectedPatient}
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
                        setValue('patientPhone', newValue);
                        return;
                      }

                      // Limit the phone to 16 digits. (eg: +351 912 345 678 -> 16 digits)
                      if (value.length > 16) {
                        return;
                      }

                      setValue('patientPhone', value);
                    }}
                  />

                  <Controller
                    name="patientBirthDate"
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        format="dd-MM-yyyy"
                        label="Data de nascimento"
                        disabled={selectedPatient}
                        slotProps={{
                          textField: {
                            helperText: error?.message,
                            error: !!error?.message,
                          },
                        }}
                        {...field}
                        value={
                          selectedPatient?.birthdate
                            ? new Date(selectedPatient?.birthdate)
                            : new Date(field.value)
                        }
                      />
                    )}
                  />

                  <RHFSelect
                    value={selectedPatient ? selectedPatient?.gender : patientGender}
                    native
                    name="patientGender"
                    label="Género"
                    disabled={selectedPatient}>
                    {genders.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>

                  <RHFTextField
                    value={selectedPatient ? selectedPatient?.address?.street : patientStreet}
                    disabled={selectedPatient}
                    name="patientStreet"
                    label="Rua"
                    onChange={e => {
                      const { value } = e.target;

                      setValue('patientStreet', value);
                    }}
                  />

                  <RHFTextField
                    value={
                      selectedPatient ? selectedPatient?.address?.postal_code : patientPostalCode
                    }
                    disabled={selectedPatient}
                    name="patientPostalCode"
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
                      if (patientCountry === 'PT' || patientCountry === '') {
                        // Add a dash to the zip code if it doesn't have one. Format example: XXXX-XXX
                        if (value.length === 5 && value[4] !== '-') {
                          setValue(
                            'patientPostalCode',
                            `${value[0]}${value[1]}${value[2]}${value[3]}-${value[4]}`
                          );

                          return;
                        }

                        // Do not allow the zip code to have more than 8 digits (XXXX-XXX -> 8 digits)
                        if (value.length > 8) {
                          return;
                        }
                      }

                      setValue('patientPostalCode', value);
                    }}
                  />

                  <RHFTextField
                    value={selectedPatient ? selectedPatient?.address?.city : patientCity}
                    disabled={selectedPatient}
                    name="patientCity"
                    label="Cidade"
                    onChange={e => {
                      const { value } = e.target;

                      setValue('patientCity', value);
                    }}
                  />

                  <RHFSelect
                    value={selectedPatient ? selectedPatient?.address?.country : patientCountry}
                    disabled={selectedPatient}
                    native
                    name="patientCountry"
                    label="País"
                    onChange={e => {
                      const { value } = e.target;

                      setValue('patientCountry', value);
                    }}>
                    <option value="" />
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
                <RHFTextField
                  value={
                    selectedPatient ? selectedPatient?.medical_conditions : patientMedicalConditions
                  }
                  disabled={selectedPatient}
                  name="patientMedicalConditions"
                  label="Informações Médicas"
                  multiline
                  minRows={4}
                  maxRows={8}
                  sx={{ mb: 3, mt: 3 }}
                />
              </Collapse>
              <Divider sx={{ borderStyle: 'dashed' }} />
            </Stack>

            <Stack spacing={3}>
              <Divider sx={{ borderStyle: 'dashed' }} />

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Familiar
              </Typography>
              <AvatarAutocomplete
                disabled={openAddNewCustomer}
                selectedItem={
                  selectedCustomer
                    ? {
                        value: selectedCustomer?._id,
                        text: selectedCustomer?.name,
                        avatar: selectedCustomer?.profile_picture || null,
                      }
                    : null
                }
                label="Selecionar Familiar"
                onEditClick={() => setSelectedCustomer(null)}
                onChange={(event, newValue) => {
                  if (newValue) {
                    const foundCustomer = customers.find(obj => {
                      return obj._id === newValue.value;
                    });
                    setSelectedCustomer(foundCustomer);
                    return;
                  }
                  setSelectedCustomer(null);
                }}
                options={customers.map(customer => {
                  return {
                    value: customer._id,
                    text: customer.name,
                    avatar: customer.profile_picture || null,
                  };
                })}
              />
              {!selectedCustomer && (
                <Stack width="100%" alignItems="flex-end" justifyContent="flex-start">
                  <Button
                    variant="text"
                    sx={{
                      color: openAddNewCustomer ? 'red' : 'primary.main',
                    }}
                    onClick={() =>
                      setOpenAddNewCustomer(prev => {
                        if (!prev === false) clearCustomerFields();
                        return !prev;
                      })
                    }>
                    {!openAddNewCustomer ? 'Adicionar Familiar' : 'Cancelar'}
                  </Button>
                </Stack>
              )}
              <Collapse in={openAddNewCustomer || selectedCustomer} unmountOnExit>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}>
                  <RHFTextField
                    name="customerFirstName"
                    label="Nome"
                    value={
                      selectedCustomer ? selectedCustomer?.name.split(' ')[0] : customerFirstName
                    }
                    disabled={!!selectedCustomer}
                  />

                  <RHFTextField
                    name="customerLastName"
                    label="Apelido"
                    value={
                      selectedCustomer ? selectedCustomer?.name.split(' ')[1] : customerLastName
                    }
                    disabled={!!selectedCustomer}
                  />

                  <RHFPhoneField
                    name="customerPhone"
                    label="Telefone"
                    defaultCountry="PT"
                    forceCallingCode
                    value={selectedCustomer ? selectedCustomer?.phone : customerPhone}
                    disabled={!!selectedCustomer}
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
                        setValue('customerPhone', newValue);
                        return;
                      }

                      // Limit the phone to 16 digits. (eg: +351 912 345 678 -> 16 digits)
                      if (value.length > 16) {
                        return;
                      }

                      setValue('customerPhone', value);
                    }}
                  />

                  <RHFTextField
                    name="customerEmail"
                    label="Email"
                    value={selectedCustomer ? selectedCustomer?.email : customerEmail}
                    disabled={!!selectedCustomer}
                  />
                </Box>
              </Collapse>
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                disabled={disableCreateOrderButton}
                sx={{ width: '30%', alignSelf: 'flex-end', mt: '200px' }}
                onClick={() => {
                  handleCreateOrder();
                }}>
                Criar Pedido
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={openQuote}
        onClose={handleCloseQuote}
        title="Enviar Orçamento"
        content={
          <>
            Tem a certeza que pretende <strong>enviar um orçamento</strong> no total de{' '}
            <strong>{getValues('quote')}€ </strong>? <br />
            Ao confirmar, será enviado um<strong> email ao cliente </strong> com o orçamento e as{' '}
            <strong>informações</strong> necessárias para <strong>realizar o pagamento </strong>do
            mesmo.
            <br />
            <br />
            Se o pedido se encontrar ativo e atualizar o orçamento o novo valor do orçamento será
            cobrado no próximo pagamento.
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onSendQuote();
            }}>
            Enviar Orçamento
          </Button>
        }
      />

      <ConfirmDialog
        open={openScreeningVisit}
        onClose={handleCloseScreeningVisit}
        title="Marcar Visita de Avaliação"
        content={
          <>
            Tem a certeza que pretende marcar a <strong>visita de avaliação</strong> para o dia{' '}
            <strong>{fDate(getValues('screeningVisit').toString())}</strong>?{'  '}
            {'  '}
            Ao confirmar, será enviado um<strong> email ao cliente </strong> com a data da visita de
            avaliação.
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onSendScreeningVisit();
            }}>
            Marcar Visita
          </Button>
        }
      />
    </FormProvider>
  );
}

// ----------------------------------------------------------------------
