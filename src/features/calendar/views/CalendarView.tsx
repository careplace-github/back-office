import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import { DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
//
import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Button,
  Container,
  DialogTitle,
  Dialog,
  SelectChangeEvent,
  IconButton,
  Box,
} from '@mui/material';

// redux
import { useDispatch, useSelector } from 'src/redux/store';
// types
import { ICalendarEvent, ICalendarViewValue } from 'src/types/calendar';
import { ICaregiverProps } from 'src/types/caregiver';
import { getEvents, createEvent, updateEvent, deleteEvent } from 'src/redux/slices/calendar';
// utils
import { fTimestamp } from 'src/utils/formatTime';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/contexts';
import { useDateRangePicker } from 'src/components/date-range-picker';
// sections
import { CalendarForm, StyledCalendar, CalendarToolbar, CalendarFilterDrawer } from '../components';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#1890FF', // light blue
  '#04297A', // dark blue
  '#54D62C', // light green
  '#054f02', // dark green
  '#f7000d', // light red
  '#800108', // dark red
  '#FFC0CB', // light pink
  '#FF1493', // dark pink
];

// ----------------------------------------------------------------------

export default function CalendarPage({ caregivers }) {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const useGetEvents = () => {
    const eventsDispatch = useDispatch();
    const { events: data } = useSelector(state => state.calendar);

    const getAllEvents = useCallback(async () => {
      setIsCalendarLoading(true);
      await eventsDispatch(getEvents());
      setIsCalendarLoading(false);
    }, [eventsDispatch]);

    useEffect(() => {
      getAllEvents();
    }, [getAllEvents]);

    return data;
  };

  const calendarRef = useRef<FullCalendar>(null);

  const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);
  const events = useGetEvents();

  const [openForm, setOpenForm] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const selectedEvent = useSelector(() => {
    if (selectedEventId) {
      return events.find(event => event._id === selectedEventId);
    }

    return null;
  });

  const picker = useDateRangePicker(null, null);

  const [date, setDate] = useState(new Date());

  const [openFilter, setOpenFilter] = useState(false);

  const [filterEventColor, setFilterEventColor] = useState<string[]>([]);

  const [filterEventType, setFilterEventType] = useState(['health_unit', 'collaborator']);

  const [selectedCaregiver, setSelectedCaregiver] = useState<ICaregiverProps>();

  const [view, setView] = useState<ICalendarViewValue>(isDesktop ? 'dayGridMonth' : 'listWeek');

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleOpenModal = () => {
    setOpenForm(true);
  };

  const handleCloseModal = () => {
    setOpenForm(false);
    setSelectedRange(null);
    setSelectedEventId(null);
  };

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

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

  const handleChangeView = (newView: ICalendarViewValue) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.unselect();
    }
    handleOpenModal();
    setSelectedRange({
      start: arg.start,
      end: arg.end,
    });
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    handleOpenModal();

    setSelectedEventId(arg.event.extendedProps._id);
  };

  const handleResizeEvent = ({ event }: EventResizeDoneArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = ({ event }: EventDropArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUpdateEvent = async (newEvent: ICalendarEvent) => {
    setIsCalendarLoading(true);
    if (selectedEventId) {
      await dispatch(updateEvent(selectedEventId, newEvent));
      enqueueSnackbar('Evento atualizado com sucesso!');
    } else {
      await dispatch(createEvent(newEvent));
      enqueueSnackbar('Evento criado com sucesso!');
    }
    setIsCalendarLoading(false);
  };

  const handleDeleteEvent = async (event: ICalendarEvent) => {
    setIsCalendarLoading(true);
    try {
      if (selectedEventId) {
        await handleCloseModal();
        await dispatch(deleteEvent(selectedEventId, event));
        enqueueSnackbar('Evento eliminado com sucesso!');
      }
    } catch (error) {
      console.error(error);
    }
    setIsCalendarLoading(false);
  };

  const handleFilterEventColor = (eventColor: string) => {
    const checked = filterEventColor.includes(eventColor)
      ? filterEventColor.filter(value => value !== eventColor)
      : [...filterEventColor, eventColor];

    setFilterEventColor(checked);
  };

  const handleFilterEventType = (eventType: string) => {
    const checked = filterEventType.includes(eventType)
      ? filterEventType.filter(value => value !== eventType)
      : [...filterEventType, eventType];

    setFilterEventType(checked);
  };

  const handleResetFilter = () => {
    const { setStartDate, setEndDate } = picker;

    if (setStartDate && setEndDate) {
      setStartDate(null);
      setEndDate(null);
    }

    setFilterEventColor([]);
    setFilterEventType(['health_unit', 'collaborator']);
    setSelectedCaregiver(undefined);
  };

  const dataFiltered = applyFilter({
    inputData: events,
    filterEventColor,
    filterEventType,
    filterStartDate: picker.startDate,
    filterEndDate: picker.endDate,
    isError: !!picker.isError,
    filterCaregiver: selectedCaregiver,
  });

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Calendário"
          links={[
            {
              name: 'Agendamentos',
            },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModal}>
              Adicionar Evento
            </Button>
          }
        />

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
              onOpenFilter={() => setOpenFilter(true)}
              isCalendarLoading={isCalendarLoading}
            />

            <FullCalendar
              weekends
              editable
              droppable
              selectable
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              headerToolbar={false}
              initialEvents={events}
              select={handleSelectRange}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isDesktop ? 720 : 'auto'}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleCloseModal}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <DialogTitle>{selectedEvent ? 'Editar' : 'Adicionar'}</DialogTitle>
          <IconButton
            onClick={() => {
              handleCloseModal();
              setSelectedEventId(null);
            }}
            sx={{
              mr: 2,
              cursor: 'pointer',
              '&:hover': {
                cursor: 'pointer',
                color: theme.palette.mode === 'light' ? 'grey.400' : 'white',
              },
            }}>
            <Iconify icon="material-symbols:close-rounded" />
          </IconButton>
        </Box>

        <CalendarForm
          event={selectedEvent}
          range={selectedRange}
          onCancel={handleCloseModal}
          onCreateUpdateEvent={handleCreateUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          colorOptions={COLOR_OPTIONS}
        />
      </Dialog>

      <CalendarFilterDrawer
        events={dataFiltered}
        picker={picker}
        openFilter={openFilter}
        colorOptions={COLOR_OPTIONS}
        onResetFilter={handleResetFilter}
        filterEventType={filterEventType}
        onFilterEventType={handleFilterEventType}
        caregivers={caregivers}
        selectedCaregiver={selectedCaregiver}
        onSelectedCaregiver={handleChangeSelectedCaregiver}
        filterEventColor={filterEventColor}
        onCloseFilter={() => setOpenFilter(false)}
        onFilterEventColor={handleFilterEventColor}
        onSelectEvent={eventId => {
          if (eventId) {
            handleOpenModal();
            setSelectedEventId(eventId);
          }
        }}
      />
    </>
  );
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filterEventColor,
  filterStartDate,
  filterEndDate,
  isError,
  filterEventType,
  filterCaregiver,
}: {
  inputData: EventInput[];
  filterEventColor: string[];
  filterStartDate: Date | null;
  filterEndDate: Date | null;
  isError: boolean;
  filterEventType: string[];
  filterCaregiver: ICaregiverProps | null | undefined;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  inputData = stabilizedThis.map(el => el[0]);

  // get the evnents that have the selected caregiver
  if (filterCaregiver) {
    const caregiverId = filterCaregiver._id;
    inputData = inputData.filter(
      (event: EventInput) => event?.order?.caregiver?._id === caregiverId
    );
  }

  if (filterEventColor.length) {
    inputData = inputData.filter((event: EventInput) =>
      filterEventColor.includes(event.textColor as string)
    );
  }

  if (filterEventType.length) {
    inputData = inputData.filter(event => filterEventType.includes(event.owner_type));
  }

  if (filterEventType.length === 0) {
    inputData = [];
  }

  if (filterStartDate && filterEndDate && !isError) {
    inputData = inputData.filter(
      (event: EventInput) =>
        fTimestamp(event.start as Date) >= fTimestamp(filterStartDate) &&
        fTimestamp(event.end as Date) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
