// react
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useRouter } from 'next/router';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  DialogActions,
  Avatar,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns';
// components
import Iconify from 'src/components/iconify';
import { ColorSinglePicker } from 'src/components/color-utils';
import FormProvider, { RHFTextField, RHFSwitch } from 'src/components/hook-form';
import ConfirmDialog from 'src/components/confirm-dialog';

// routes
import { PATHS } from 'src/routes';
import { useSession } from 'next-auth/react';
import useSessionStorage from 'src/hooks/use-session-storage';

// ----------------------------------------------------------------------

const getInitialValues = (event, range) => {
  const initialEvent = {
    _id: event?._id,
    title: event?.title || '',
    description: event?.description || '',
    textColor: event?.textColor || '#1890FF',
    event_series: event?.event_series,
    allDay: false,
    start: range ? parseISO(range.start) : new Date(),
    end: range ? parseISO(range.end) : new Date(),
    owner_type: 'collaborator',
  };

  if (event || range) {
    let _event = merge({}, initialEvent, event);

    _event = {
      ..._event,
      start: _event.start ? parseISO(_event.start) : new Date(),
      end: _event.end ? parseISO(_event.end) : new Date(),
    };

    return _event;
  }

  return initialEvent;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
};

export default function CalendarForm({
  event,
  range,
  colorOptions,
  onCreateUpdateEvent,
  onDeleteEvent,
  onCancel,
}) {
  const { data: user } = useSession();

  const [permissions, setPermissions] = useSessionStorage('permissions', '');

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
    }
  }, [user, setPermissions]);

  const hasEventData = !!event;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Dê um titulo ao seu evento'),
    description: Yup.string().max(5000),
    textColor: Yup.string().required('Selecione uma cor'),
    start: Yup.date().required('Selecione uma data de início'),
    end: Yup.date().required('Selecione uma data de término'),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    watch,
    control,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();

  const [openDeleteEvent, setOpenDeleteEvent] = useState(false);

  const handleCloseDeleteEvent = () => {
    setOpenDeleteEvent(false);
  };

  const onSubmit = async data => {
    try {
      const newEvent = {
        title: data.title,
        description: data.description,
        textColor: data.textColor,
        allDay: data.allDay,
        start: data.start,
        end: data.end,
        owner_type: data.owner_type || 'collaborator',
        event_series: data.event_series,
      };

      onCreateUpdateEvent(newEvent);

      onCancel();

      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const { push } = useRouter();

  // Redirect to the order detail page with the event.series as the order id
  const onViewEvent = async () => {
    // open in new tab
    window.open(`${PATHS.orders.view(event?.order?._id)}`, '_blank');
  };

  /**
   * const isDateError =
    !values.allDay && values.start && values.end
      ? isBefore(new Date(values.end), new Date(values.start))
      : false;
   */

  const isDateError = false;

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ px: 3 }}>
          <RHFTextField name="title" label="Título *" InputLabelProps={{ shrink: true }} />

          {event?.owner_type === 'health_unit' && (
            <Box display="flex" alignItems="center">
              <Avatar src={event?.order?.caregiver?.profile_picture} />
              <Typography variant="subtitle2" component="span" sx={{ ml: 2 }}>
                {event?.order?.caregiver?.name}
              </Typography>
            </Box>
          )}
          <RHFTextField
            name="description"
            label="Descrição"
            InputLabelProps={{ shrink: true }}
            multiline
            rows={3}
            disabled={
              event?.owner_type !== 'collaborator' && !user?.permissions?.includes('calendar_edit')
            }
          />

          <Controller
            name="start"
            control={control}
            render={({ field }) => (
              <MobileDateTimePicker
                {...field}
                disabled={event?.owner_type === 'health_unit' && event?.event_series}
                onChange={newValue => field.onChange(newValue)}
                label="Data de Início *"
                ampm={false}
                ampmInClock={false}
                autoFocus
                format="dd/MM/yyyy HH:mm"
              />
            )}
          />

          <Controller
            name="end"
            control={control}
            render={({ field }) => (
              <MobileDateTimePicker
                {...field}
                disabled={event?.owner_type === 'health_unit' && event?.event_series}
                onChange={newValue => field.onChange(newValue)}
                label="Data de Fim *"
                ampm={false}
                ampmInClock={false}
                autoFocus
                format="dd/MM/yyyy HH:mm"
              />
            )}
          />

          <Controller
            name="textColor"
            control={control}
            render={({ field }) => (
              <ColorSinglePicker
                value={field.value}
                onChange={field.onChange}
                colors={colorOptions}
              />
            )}
          />

          <Typography
            sx={{ fontSize: '12px', color: '#91A0AD', marginTop: '10px', marginLeft: '5px' }}>
            * Campo obrigatório
          </Typography>
        </Stack>

        <DialogActions>
          {/* ------------------- COLLABORATOR EVENT -------------------  */}
          {!(event?.owner_type === 'health_unit' && event?.event_series) && hasEventData && (
            <Tooltip title="Apagar Evento">
              <IconButton
                onClick={() => {
                  setOpenDeleteEvent(true);
                }}>
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Tooltip>
          )}

          {/* ------------------- HEALTH UNIT EVENT -------------------  */}

          <Box sx={{ flexGrow: 1 }} />

          {event?.owner_type === 'health_unit' &&
            permissions.includes('calendar_view') &&
            permissions.includes('orders_view') && (
              <Button variant="outlined" color="primary" onClick={onViewEvent}>
                Ver Pedido
              </Button>
            )}

          {(event?.owner_type === 'collaborator' ||
            event === null ||
            (event?.owner_type === 'health_unit' &&
              user?.permissions?.includes('calendar_edit'))) && (
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!isDirty}>
              {hasEventData ? 'Guardar' : 'Adicionar'}
            </LoadingButton>
          )}
        </DialogActions>
      </FormProvider>

      <ConfirmDialog
        open={openDeleteEvent}
        onClose={handleCloseDeleteEvent}
        title="Eliminar Evento"
        content="Tem a certeza que pretende eliminar este evento?"
        action={
          <Button variant="contained" color="error" onClick={() => onDeleteEvent(event)}>
            Eliminar
          </Button>
        }
      />
    </>
  );
}
