import PropTypes from 'prop-types';
import * as Yup from 'yup';
import React, { useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
// next
import { useRouter } from 'next/router';
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
  TextField,
  Typography,
  InputAdornment,
  Divider,
  Box,
  Button,
  Tooltip,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';
import { parseISO } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers';
// routes
import { PATHS } from 'src/routes';
import { MobileDateTimePicker, TimePicker } from '@mui/x-date-pickers';
// data
import { genders, countries } from 'src/data';
import {
  WEEK_DAYS_OPTIONS,
  RECURRENCY_OPTIONS,
  ORIGIN_OPTIONS,
  STATUS_OPTIONS,
  STATUS_OPTIONS_EXTERNAL,
} from 'src/data/orders';
// components
import Label from 'src/components/label';
import AvatarDropdown from 'src/components/avatar-dropdown';
import { useSnackbar } from 'src/components/snackbar';
import ConfirmDialog from 'src/components/confirm-dialog';
import { useResponsive } from 'src/hooks';

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFPhoneField,
  RHFAutocomplete,
} from 'src/components/hook-form';
// utils
import { getRecurrencyText, getScheduleText, getStatusText } from 'src/utils/orderUtils';
import { getWeekDayName } from 'src/utils/orderUtils';
import Iconify from 'src/components/iconify/Iconify';
import { fDate } from 'src/utils/formatTime';
// lib
import fetch from 'src/lib/fetch';
// types
import { IServiceProps } from 'src/types';
import { IScheduleProps } from 'src/types/order';
import { ICaregiverProps } from 'src/types/caregiver';

import { filter, set } from 'lodash';
import { getValue } from '@mui/system';
import { s } from '@fullcalendar/core/internal-common';

// ----------------------------------------------------------------------

type Props = {
  isScreening?: boolean;
  isView?: boolean;
  isEdit?: boolean;
  currentOrder: any;
  services: IServiceProps[];
  caregivers: any;
};

export default function OrderDetailForm({
  isScreening = false,
  isView = false,
  isEdit = false,
  currentOrder,
  services = [],
  caregivers,
}: Props) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Insira um nome'),
    // description: Yup.string().required('Insira uma descrição'),
    // images: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Insira um valor'),
  });

  const [isOrderDirty, setIsOrderDirty] = useState(false);
  const [isPatientDirty, setIsPatientDirty] = useState(false);
  const [isCustomerDirty, setIsCustomerDirty] = useState(false);

  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [isPatientLoading, setIsPatientLoading] = useState(false);
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [isScreeningVisitLoading, setIsScreeningVisitLoading] = useState(false);

  // from currentOrder.visits array find the visit that is the next one
  // if there is no visit in the future, return the last one
  const nextVisit = useMemo(() => {
    const visits = currentOrder?.visits || [];

    const _nextVisit = visits.find(visit => {
      const visitDate = new Date(visit.start);
      const today = new Date();

      return visitDate > today;
    });

    return _nextVisit?.start;
  }, [currentOrder]);

  const lastVisit = useMemo(() => {
    const visits = currentOrder?.visits || [];

    const _lastVisit = visits.find(visit => {
      const visitDate = new Date(visit.start);
      const today = new Date();

      return visitDate < today;
    });

    return _lastVisit?.start;
  }, [currentOrder]);

  const defaultValues = useMemo(
    () => ({
      name: currentOrder?.name || '',
      description: currentOrder?.description || '',
      images: currentOrder?.images || [],
      code: currentOrder?.code || '',
      sku: currentOrder?.sku || '',
      price: currentOrder?.price || 0,
      quote: currentOrder?.order_total || 0,
      tags: currentOrder?.tags || [],
      inStock: true,
      taxes: true,
      gender: currentOrder?.gender || '',
      category: currentOrder?.category || '',
      screeningVisit: currentOrder?.screening_visit || '',

      nextVisit: new Date(nextVisit),
      lastVisit: new Date(lastVisit),
      caregiver: currentOrder?.caregiver || '',
      orderStart: currentOrder?.schedule_information?.start_date || '',
      orderStatus: currentOrder?.status || '',
      orderType: currentOrder?.type || '',
      recurrency: currentOrder?.schedule_information?.recurrency || '',
      services: currentOrder?.services.map(service => service._id) || [],

      week_days:
        (currentOrder?.schedule_information?.schedule?.map(
          schedule => schedule.week_day
        ) as number[]) || [],

      // ----------------------------

      // ---------- PATIENT ----------

      patientFirstName: currentOrder?.patient?.name.split(' ')[0] || '',
      patientLastName: currentOrder?.patient?.name.split(' ').slice(-1)[0] || '',
      patientPhone: currentOrder?.patient?.phone || '',
      patientBirthDate: currentOrder?.patient?.birthdate || '',
      patientGender: currentOrder?.patient?.gender || '',
      patientAddress:
        currentOrder?.patient?.address?.street &&
        currentOrder?.patient?.address?.postal_code &&
        currentOrder?.patient?.address?.city
          ? `${currentOrder.patient.address.street}, ${currentOrder.patient.address.postal_code} ${currentOrder.patient.address.city}`
          : '',

      patientStreet: currentOrder?.patient?.address?.street || '',
      patientPostalCode: currentOrder?.patient?.address?.postal_code || '',
      patientCity: currentOrder?.patient?.address?.city || '',
      patientCountry: currentOrder?.patient?.address?.country || 'PT',
      patientMedicalConditions: currentOrder?.patient?.medical_conditions || '',

      // ----------------------------

      // ---------- CUSTOMER ----------

      customerFirstName: currentOrder?.customer?.name.split(' ')[0] || '',
      customerLastName: currentOrder?.customer?.name.split(' ').pop() || '',
      customerPhone: currentOrder?.customer?.phone || '',
      customerEmail: currentOrder?.customer?.email || '',

      // ----------------------------
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOrder]
  );

  const isMarketplaceOrders = currentOrder?.type === 'marketplace';

  const [declineReason, setDeclineReason] = useState<string>('');

  const [filterWeekdays, setFilterWeekdays] = useState<IScheduleProps[]>(
    currentOrder?.schedule_information?.schedule || []
  );
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
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();

  const [dialogDate, setDialogDate] = useState(getValues('screeningVisit'));

  const [visitStart, setVisitStart] = useState<Date | null>(currentOrder?.screening_visit || null);
  const [visitEnd, setVisitEnd] = useState<Date | null>(currentOrder?.screening_visit || null);
  const [visitDate, setVisitDate] = useState<Date | null>(currentOrder?.screening_visit || null);

  const handleSaveOrder = async () => {
    const data = {
      caregiver: selectedCaregiver,
      schedule_information: {
        start_date: getValues('orderStart'),
        recurrency: getValues('recurrency'),
        schedule: filterWeekdays,
      },
      services: getValues('services'),
      status: getValues('orderStatus'),
    };

    try {
      await fetch(`/api/orders/home-care/${currentOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setIsOrderDirty(false);
      setIsOrderLoading(false);
      currentOrder.status = getValues('orderStatus');
      enqueueSnackbar('Pedido atualizado com sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Ocorreu um erro ao atualizar o pedido, por favor tente novamente!', {
        variant: 'error',
      });
    }
  };

  const handleSavePatient = async () => {
    const data = {
      name: `${getValues('patientFirstName')} ${getValues('patientLastName')}`,
      phone: getValues('patientPhone'),
      birthdate: getValues('patientBirthDate'),
      gender: getValues('patientGender'),
      address: {
        street: getValues('patientAddress').split(',')[0],
        postal_code: getValues('patientAddress').split(',')[1].split(' ')[1],
        city: getValues('patientAddress').split(',')[1].split(' ')[2],
        country: getValues('patientCountry'),
      },
      medical_conditions: getValues('patientMedicalConditions'),
    };

    try {
      await fetch(`/api/patients/${currentOrder.patient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setIsPatientDirty(false);
      setIsPatientLoading(false);

      enqueueSnackbar('Utente atualizado com sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Ocorreu um erro ao atualizar o utente, por favor tente novamente!', {
        variant: 'error',
      });
    }
  };

  const handleSaveCustomer = async () => {
    const data = {
      name: `${getValues('customerFirstName')} ${getValues('customerLastName')}`,
      phone: getValues('customerPhone'),
      email: getValues('customerEmail'),
    };

    try {
      await fetch(`/api/customers/${currentOrder.customer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setIsCustomerDirty(false);
      setIsCustomerLoading(false);

      enqueueSnackbar('Familiar atualizado com sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Ocorreu um erro ao atualizar o familiar, por favor tente novamente!', {
        variant: 'error',
      });
    }
  };

  const handleRemoveFile = inputFile => {
    const filtered = values.images && values.images?.filter(file => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  const onSubmit = data => {};

  const handleChangeSelectedCaregiver: (
    event: SelectChangeEvent<string>,
    child: ReactNode
  ) => void = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    const caregiver = value as string;

    setSelectedCaregiver(JSON.parse(caregiver));
    setIsOrderDirty(true);
  };

  const isSmUp = useResponsive('up', 'sm');

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmState, setConfirmState] = useState('');

  const [selectedCaregiver, setSelectedCaregiver] = useState<ICaregiverProps>(
    currentOrder?.caregiver
  );

  const onConfirmDialog = async state => {
    if (state === 'reject') {
      await fetch('/api/orders/home-care/decline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          declineReason,
          orderId: currentOrder._id,
        }),
      });

      enqueueSnackbar('Pedido rejeitado!', { variant: 'warning' });

      push(PATHS.orders.root);
    } else if (state === 'accept') {
      await fetch('/api/orders/home-care/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: currentOrder._id,
          caregiverId: selectedCaregiver._id,
        }),
      });

      enqueueSnackbar('Pedido aceite com sucesso!');

      // Reload the page
      window.location.reload();
    }

    setOpenConfirm(false);
    setConfirmState('');
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const [openQuote, setOpenQuote] = useState(false);

  const onSendQuote = async () => {
    try {
      setIsQuoteLoading(true);
      await fetch(`/api/orders/home-care/send-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: currentOrder._id,
          order_total: getValues('quote'),
        }),
      });

      setIsQuoteLoading(false);
      setOpenQuote(false);
      enqueueSnackbar('Orçamento enviado com sucesso!');

      // Reload the page
      window.location.reload();
    } catch (error) {
      enqueueSnackbar('Ocorreu um erro ao enviar o orçamento, por favor tente novamente!', {
        variant: 'error',
      });
      setOpenQuote(false);
    }
  };

  const handleCloseQuote = () => {
    setOpenQuote(false);
  };

  // ----------------------------

  const [openScreeningVisit, setOpenScreeningVisit] = useState(false);

  const onSendScreeningVisit = async () => {
    try {
      const start = new Date(getValues('screeningVisit'));
      // set the hours according to visitStart
      start.setHours(visitStart?.getHours() as number);
      start.setMinutes(visitStart?.getMinutes() as number);

      const end = new Date(getValues('screeningVisit'));
      // set the hours according to visitEnd
      end.setHours(visitEnd?.getHours() as number);
      end.setMinutes(visitEnd?.getMinutes() as number);

      setIsScreeningVisitLoading(true);
      await fetch(`/api/orders/home-care/schedule-visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: currentOrder._id,
          visit_start: start,
          visit_end: end,
        }),
      });

      setIsScreeningVisitLoading(false);

      setOpenScreeningVisit(false);
      enqueueSnackbar('Visita de avaliação marcada com sucesso!');

      // reload page
      window.location.reload();
    } catch (error) {
      enqueueSnackbar(
        'Ocorreu um erro ao marcar a visita de avaliação, por favor tente novamente!',
        {
          variant: 'error',
        }
      );
      setOpenScreeningVisit(false);
    }
  };

  const handleCloseScreeningVisit = () => {
    setOpenScreeningVisit(false);
  };

  // ----------------------------

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
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
                  sx={{
                    width: '100%',
                    '& .MuiAutocomplete-tag': {
                      maxWidth: '190px',
                    },
                  }}
                  multiple
                  disabled={
                    isView ||
                    currentOrder?.status === 'new' ||
                    currentOrder?.status === 'cancelled' ||
                    currentOrder?.status === 'declined'
                  }
                  freeSolo
                  onChange={(event, newValue) => {
                    setValue('services', newValue);
                    setIsOrderDirty(true);
                  }}
                  options={services.map(option => option._id)}
                  getOptionLabel={_id => services.find(option => option._id === _id)?.name || ''}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Tooltip title={services.find(item => item._id === option)?.name} arrow>
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
                  sx={{ width: '100%' }}
                  label="Dias da Semana"
                  aria-multiline={false}
                  multiple
                  // only 1 line

                  disabled={
                    isView ||
                    currentOrder?.status === 'new' ||
                    currentOrder?.status === 'cancelled' ||
                    currentOrder?.status === 'declined'
                  }
                  freeSolo
                  onChange={(event, newValue) => {
                    // From the newValue
                    setValue('week_days', newValue as number[]);
                    setIsOrderDirty(true);

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
                      sx={{ width: '100%' }}
                      format="dd-MM-yyyy"
                      label="Início Pretendido"
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          helperText: error?.message,
                          error: !!error?.message,
                        },
                      }}
                      {...field}
                      disabled={
                        isView ||
                        currentOrder?.status === 'new' ||
                        currentOrder?.status === 'cancelled' ||
                        currentOrder?.status === 'declined'
                      }
                      value={new Date(field.value)}
                      onChange={date => {
                        setValue('orderStart', date);
                        setIsOrderDirty(true);
                      }}
                    />
                  )}
                />

                <RHFSelect
                  sx={{ width: '100%' }}
                  native
                  name="recurrency"
                  label="Recorrência"
                  InputLabelProps={{ shrink: true }}
                  disabled={
                    isView ||
                    currentOrder?.status === 'new' ||
                    currentOrder?.status === 'cancelled' ||
                    currentOrder?.status === 'declined'
                  }
                  onChange={e => {
                    const { value } = e.target;

                    setValue('recurrency', value);
                    setIsOrderDirty(true);
                  }}>
                  {RECURRENCY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
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
                              gap: '20px',
                              flex: 1,
                              pb: 1,
                            }}>
                            <Stack gap="16px" direction="row">
                              <TimePicker
                                disabled={
                                  isView ||
                                  currentOrder?.status === 'new' ||
                                  currentOrder?.status === 'cancelled' ||
                                  currentOrder?.status === 'declined'
                                }
                                ampm={false}
                                label={`${weekdayItem.label} (início)`}
                                onChange={date => {
                                  const newSchedule = filterWeekdays.map(schedule => {
                                    if (schedule.week_day === item.week_day) {
                                      schedule.start = date;
                                    }
                                    return schedule;
                                  });

                                  setFilterWeekdays(newSchedule);
                                  setIsOrderDirty(true);
                                }}
                                sx={{ flex: 1 }}
                                value={item.start ? new Date(item.start) : null} // And here
                              />

                              <TimePicker
                                disabled={
                                  isView ||
                                  currentOrder?.status === 'new' ||
                                  currentOrder?.status === 'cancelled' ||
                                  currentOrder?.status === 'declined'
                                }
                                onChange={date => {
                                  const newSchedule = filterWeekdays.map(schedule => {
                                    if (schedule.week_day === item.week_day) {
                                      schedule.end = date;
                                    }
                                    return schedule;
                                  });

                                  setFilterWeekdays(newSchedule);
                                  setIsOrderDirty(true);
                                }}
                                skipDisabled
                                ampm={false}
                                label={`${weekdayItem.label} (fim)`}
                                sx={{ flex: 1 }}
                                value={item.end ? new Date(item.end) : null} // And here
                              />
                            </Stack>
                          </Box>
                        </Grid>
                      );
                    })}
              </Grid>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}>
                {' '}
                <>
                  <RHFSelect
                    native
                    name="orderType"
                    label="Origem de Pedido"
                    InputLabelProps={{ shrink: true }}
                    disabled>
                    {ORIGIN_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>

                  {currentOrder?.status !== 'new' && (
                    <AvatarDropdown
                      onChange={handleChangeSelectedCaregiver}
                      selected={JSON.stringify(selectedCaregiver)}
                      options={caregivers}
                      disabled={isView}
                      emptyText="Nenhum cuidador encontrado"
                      selectText="Selecione um cuidador"
                      avatarSize={30}
                    />
                  )}
                </>
              </Box>

              {currentOrder?.type !== 'marketplace' && (
                <Box
                  sx={{
                    maxWidth: '50%',
                    pr: 1,
                  }}>
                  <RHFSelect
                    native
                    name="orderStatus"
                    label="Estado do Pedido"
                    InputLabelProps={{ shrink: true }}
                    disabled={isView}
                    onChange={e => {
                      const { value } = e.target;

                      setValue('orderStatus', value);
                      setIsOrderDirty(true);
                    }}>
                    {currentOrder?.type === 'marketplace'
                      ? STATUS_OPTIONS_EXTERNAL.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      : STATUS_OPTIONS_EXTERNAL.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                  </RHFSelect>
                </Box>
              )}

              {currentOrder?.status !== 'new' &&
                currentOrder?.status !== 'cancelled' &&
                currentOrder?.status !== 'declined' && (
                  <LoadingButton
                    variant="contained"
                    disabled={isView || !isOrderDirty || isOrderLoading}
                    sx={{ width: '20%', alignSelf: 'flex-end' }}
                    loading={isOrderLoading}
                    onClick={() => {
                      setIsOrderLoading(true);
                      handleSaveOrder();
                    }}>
                    Guardar
                  </LoadingButton>
                )}

              <Divider sx={{ borderStyle: 'dashed' }} />
            </Stack>

            <Stack spacing={3}>
              <Divider sx={{ borderStyle: 'dashed' }} />

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Utente
              </Typography>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}>
                <RHFTextField
                  name="patientFirstName"
                  label="Nome"
                  disabled={isView || isMarketplaceOrders}
                  onChange={e => {
                    const { value } = e.target;

                    setValue('patientFirstName', value);
                    setIsPatientDirty(true);
                  }}
                />

                <RHFTextField
                  name="patientLastName"
                  label="Apelido"
                  disabled={isView || isMarketplaceOrders}
                  onChange={e => {
                    const { value } = e.target;

                    setValue('patientLastName', value);
                    setIsPatientDirty(true);
                  }}
                />

                <RHFPhoneField
                  name="patientPhone"
                  label="Telefone"
                  defaultCountry="PT"
                  forceCallingCode
                  disabled={isView || isMarketplaceOrders}
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
                      setIsPatientDirty(true);
                      return;
                    }

                    // Limit the phone to 16 digits. (eg: +351 912 345 678 -> 16 digits)
                    if (value.length > 16) {
                      return;
                    }

                    setValue('patientPhone', value);
                    setIsPatientDirty(true);
                  }}
                />

                <Controller
                  name="patientBirthDate"
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      disabled={isView || isMarketplaceOrders}
                      maxDate={new Date()}
                      format="dd-MM-yyyy"
                      label="Data de Nascimento"
                      slotProps={{
                        textField: {
                          helperText: error?.message,
                          error: !!error?.message,
                        },
                      }}
                      {...field}
                      value={new Date(field.value)}
                      onChange={date => {
                        setValue('patientBirthDate', date);
                        setIsPatientDirty(true);
                      }}
                    />
                  )}
                />

                <RHFSelect
                  native
                  name="patientGender"
                  label="Género"
                  disabled={isView || isMarketplaceOrders}
                  onChange={e => {
                    const { value } = e.target;

                    setValue('patientGender', value);
                    setIsPatientDirty(true);
                  }}>
                  {genders.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>

                {currentOrder.type === 'marketplace' && (
                  <RHFTextField
                    name="patientAddress"
                    label="Morada"
                    disabled={isView || isMarketplaceOrders}
                  />
                )}

                {currentOrder.type !== 'marketplace' && (
                  <>
                    <RHFTextField
                      name="patientStreet"
                      label="Rua"
                      disabled={isView || isMarketplaceOrders}
                      onChange={e => {
                        const { value } = e.target;

                        setValue('patientStreet', value);
                        setIsPatientDirty(true);
                      }}
                    />

                    <RHFTextField
                      name="patientPostalCode"
                      disabled={isView || isMarketplaceOrders}
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
                        if (
                          getValues('patientCountry') === 'PT' ||
                          getValues('patientCountry') === ''
                        ) {
                          // Add a dash to the zip code if it doesn't have one. Format example: XXXX-XXX
                          if (value.length === 5 && value[4] !== '-') {
                            setValue(
                              'patientPostalCode',
                              `${value[0]}${value[1]}${value[2]}${value[3]}-${value[4]}`
                            );
                            setIsPatientDirty(true);
                            return;
                          }

                          // Do not allow the zip code to have more than 8 digits (XXXX-XXX -> 8 digits)
                          if (value.length > 8) {
                            return;
                          }
                        }

                        setValue('patientPostalCode', value);
                        setIsPatientDirty(true);
                      }}
                    />

                    <RHFTextField
                      name="patientCity"
                      label="Cidade"
                      onChange={e => {
                        const { value } = e.target;

                        setValue('patientCity', value);
                        setIsPatientDirty(true);
                      }}
                      disabled={isView || isMarketplaceOrders}
                    />

                    <RHFSelect
                      native
                      name="patientCountry"
                      label="País"
                      onChange={e => {
                        const { value } = e.target;

                        setIsPatientDirty(true);
                        setValue('patientCountry', value);
                      }}
                      disabled={isView || isMarketplaceOrders}>
                      <option value="" />
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </>
                )}
              </Box>

              <RHFTextField
                name="patientMedicalConditions"
                label="Informações Médicas"
                InputLabelProps={{ shrink: true }}
                value={getValues('patientMedicalConditions') || 'n/a'}
                onChange={e => {
                  setIsPatientDirty(true);
                  setValue('patientMedicalConditions', e.target.value);
                }}
                disabled={isView || isMarketplaceOrders}
                multiline
                minRows={4}
                maxRows={8}
                sx={{ mb: 3 }}
              />

              {currentOrder?.status !== 'new' &&
                currentOrder?.status !== 'cancelled' &&
                currentOrder?.status !== 'declined' &&
                !isMarketplaceOrders && (
                  <LoadingButton
                    variant="contained"
                    disabled={isView || !isPatientDirty || isPatientLoading}
                    sx={{ width: '20%', alignSelf: 'flex-end' }}
                    loading={isPatientLoading}
                    onClick={() => {
                      setIsPatientLoading(true);
                      handleSavePatient();
                    }}>
                    Guardar
                  </LoadingButton>
                )}

              <Divider sx={{ borderStyle: 'dashed' }} />
            </Stack>

            <Stack spacing={3}>
              <Divider sx={{ borderStyle: 'dashed' }} />

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Informações do Familiar
              </Typography>

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
                  onChange={e => {
                    setIsCustomerDirty(true);
                    setValue('customerFirstName', e.target.value);
                  }}
                  disabled={isView || isMarketplaceOrders}
                />

                <RHFTextField
                  name="customerLastName"
                  label="Apelido"
                  onChange={e => {
                    setIsCustomerDirty(true);
                    setValue('customerLastName', e.target.value);
                  }}
                  disabled={isView || isMarketplaceOrders}
                />

                <RHFPhoneField
                  name="customerPhone"
                  label="Telefone"
                  defaultCountry="PT"
                  forceCallingCode
                  disabled={isView || isMarketplaceOrders}
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
                      setIsCustomerDirty(true);
                      return;
                    }

                    // Limit the phone to 16 digits. (eg: +351 912 345 678 -> 16 digits)
                    if (value.length > 16) {
                      return;
                    }

                    setValue('customerPhone', value);
                    setIsCustomerDirty(true);
                  }}
                />

                <RHFTextField
                  name="customerEmail"
                  label="Email"
                  onChange={e => {
                    setIsCustomerDirty(true);
                    setValue('customerEmail', e.target.value);
                  }}
                  disabled={isView || isMarketplaceOrders}
                />
              </Box>
              {currentOrder?.status !== 'new' &&
                currentOrder?.status !== 'cancelled' &&
                currentOrder?.status !== 'declined' &&
                !isMarketplaceOrders && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    disabled={isView || !isCustomerDirty || isCustomerLoading}
                    sx={{ width: '20%', alignSelf: 'flex-end' }}
                    loading={isCustomerLoading}
                    onClick={() => {
                      setIsCustomerLoading(true);
                      handleSaveCustomer();
                    }}>
                    Guardar
                  </LoadingButton>
                )}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Próximas Ações
                  </Typography>

                  <Label
                    color={
                      (currentOrder.status === 'new' && 'info') ||
                      (currentOrder.status === 'accepted' && 'secondary') ||
                      (currentOrder.status === 'pending_payment' && 'warning') ||
                      (currentOrder.status === 'active' && 'success') ||
                      (currentOrder.status === 'completed' && 'primary') ||
                      (currentOrder.status === 'cancelled' && 'error') ||
                      (currentOrder.status === 'declined' && 'error') ||
                      'default'
                    }>
                    {getStatusText(currentOrder)}
                  </Label>
                </Box>

                {currentOrder?.status === 'new' && (
                  <>
                    <AvatarDropdown
                      onChange={handleChangeSelectedCaregiver}
                      selected={JSON.stringify(selectedCaregiver)}
                      options={caregivers}
                      disabled={isView}
                      emptyText="Nenhum cuidador encontrado"
                      selectText="Selecione um cuidador"
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="stretch">
                      <Button
                        variant="contained"
                        disabled={isView}
                        startIcon={<Iconify icon="charm:square-cross" />}
                        onClick={() => {
                          setOpenConfirm(true);
                          setConfirmState('reject');
                        }}
                        color="error">
                        Recusar
                      </Button>
                      <Button
                        variant="contained"
                        disabled={isView}
                        startIcon={<Iconify icon="material-symbols:check-box-outline" />}
                        onClick={() => {
                          if (selectedCaregiver) {
                            setOpenConfirm(true);
                            setConfirmState('accept');
                          } else {
                            enqueueSnackbar(
                              'Tem que selecionar um cuidador para aceitar o pedido.',
                              {
                                variant: 'warning',
                              }
                            );
                          }
                        }}
                        color="success">
                        Aceitar
                      </Button>
                    </Stack>
                  </>
                )}
                <Stack spacing={3}>
                  {(currentOrder?.status === 'declined' ||
                    currentOrder?.status === 'cancelled' ||
                    currentOrder?.status === 'completed') && (
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Não tem nenhuma ação a realizar.
                    </Typography>
                  )}

                  {currentOrder?.status !== 'new' && currentOrder?.status !== 'completed' && (
                    <>
                      {(nextVisit || lastVisit) && (
                        <Controller
                          name={nextVisit ? 'nextVisit' : 'lastVisit'}
                          render={({ field, fieldState: { error } }) => (
                            <DatePicker
                              minDate={new Date()}
                              format="dd-MM-yyyy"
                              label={nextVisit ? 'Próxima Visita' : 'Última Visita'}
                              readOnly
                              {...field}
                              disabled={isView}
                              value={new Date(field.value)}
                            />
                          )}
                        />
                      )}

                      <DatePicker
                        minDate={new Date()}
                        format="dd-MM-yyyy"
                        onChange={date => {
                          setValue('screeningVisit', date);
                        }}
                        label={
                          currentOrder?.visits?.length > 0
                            ? 'Nova Visita * '
                            : 'Visita de Triagem *'
                        }
                        disabled={isView}
                      />

                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <TimePicker
                          disabled={isView}
                          ampm={false}
                          label="Início *"
                          sx={{ flex: 1 }}
                          value={visitStart}
                          onChange={date => {
                            setVisitStart(date);
                          }}
                        />

                        <TimePicker
                          disabled={isView}
                          ampm={false}
                          label="Fim *"
                          sx={{ flex: 1 }}
                          value={visitEnd}
                          onChange={date => {
                            setVisitEnd(date);
                          }}
                        />
                      </Box>

                      <LoadingButton
                        variant="contained"
                        disabled={
                          isView ||
                          visitStart === null ||
                          visitEnd === null ||
                          visitStart >= visitEnd ||
                          getValues('screeningVisit') === ''
                        }
                        loading={isScreeningVisitLoading}
                        onClick={() => {
                          setOpenScreeningVisit(true);
                        }}>
                        {currentOrder?.visits.length > 0
                          ? 'Marcar Visita'
                          : 'Marcar Visita de Avaliação'}
                      </LoadingButton>
                    </>
                  )}

                  {(currentOrder?.status === 'accepted' ||
                    currentOrder?.status === 'pending_payment' ||
                    currentOrder?.status === 'active') && (
                    <>
                      {currentOrder?.status === 'accepted' && (
                        <Box
                          sx={{
                            pt: 2,
                          }}></Box>
                      )}
                      <RHFTextField
                        name="quote"
                        label="Orçamento *"
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

                      <LoadingButton
                        variant="contained"
                        disabled={isView || getValues('quote') === 0 || getValues('quote') < 0}
                        onClick={() => {
                          setOpenQuote(true);
                        }}
                        loading={isQuoteLoading}>
                        {currentOrder?.status === 'accepted'
                          ? 'Enviar Orçamento'
                          : currentOrder?.status === 'pending_payment'
                          ? 'Reenviar Orçamento'
                          : 'Atualizar Orçamento'}
                      </LoadingButton>

                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#91A0AD',
                          pt: '30px',
                          marginLeft: '5px',
                        }}>
                        * Campo obrigatório
                      </Typography>
                    </>
                  )}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={confirmState === 'accept' ? 'Aceitar Pedido' : 'Recusar Pedido'}
        content={
          <>
            Tem a certeza que pretende{' '}
            <strong>{confirmState === 'accept' ? 'aceitar' : 'recusar'}</strong> o pedido?
            <br />
            <br />
            {confirmState === 'reject' && (
              <>
                <Box mt={2}>
                  <TextField
                    label="Motivo de recusa *"
                    value={declineReason}
                    InputLabelProps={{ shrink: true }}
                    onChange={e => setDeclineReason(e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ mt: 1, display: 'block', color: 'text.secondary', fontSize: '10px' }}>
                  * Campo obrigatório
                </Typography>
              </>
            )}
          </>
        }
        action={
          <Button
            variant="contained"
            color={confirmState === 'accept' ? 'success' : 'error'}
            disabled={!declineReason && confirmState === 'reject'}
            onClick={() => {
              onConfirmDialog(confirmState);
            }}>
            {confirmState === 'accept' ? 'Aceitar' : 'Recusar'}
          </Button>
        }
      />

      <ConfirmDialog
        open={openQuote}
        onClose={handleCloseQuote}
        title="Enviar Orçamento"
        content={
          <>
            Tem a certeza que pretende <strong>enviar um orçamento</strong> no total de{' '}
            <strong>{getValues('quote')}€ </strong>? <br />
            {currentOrder?.type === 'marketplace' && (
              <>
                Ao confirmar, será enviado um<strong> email ao patiente </strong> com o orçamento e
                as <strong>informações</strong> necessárias para{' '}
                <strong>realizar o pagamento </strong>do mesmo.
                <br />
                <br />
                Se o pedido se encontrar ativo e atualizar o orçamento o novo valor do orçamento
                será cobrado no próximo pagamento.
              </>
            )}
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onSendQuote();
              setOpenQuote(false);
            }}>
            Enviar Orçamento
          </Button>
        }
      />

      <ConfirmDialog
        open={openScreeningVisit}
        onClose={handleCloseScreeningVisit}
        title={currentOrder?.visits?.length > 0 ? 'Marcar Visita' : 'Marcar Visita de Avaliação'}
        content={
          <>
            Tem a certeza que pretende marcar uma{' '}
            <strong>
              {currentOrder?.visits?.length > 0 ? ' visita ao domicílio' : 'visita de avaliação'}
            </strong>{' '}
            para o dia <strong>{fDate(getValues('screeningVisit').toString())}</strong>?{'  '}
            {'  '}
            {currentOrder?.type === 'marketplace' && (
              <>
                Ao confirmar, será enviado um<strong> email ao patiente </strong> com a data da
                visita de avaliação.
              </>
            )}
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onSendScreeningVisit();
              setOpenScreeningVisit(false);
            }}>
            Marcar Visita
          </Button>
        }
      />
    </FormProvider>
  );
}

// ----------------------------------------------------------------------
