import { createSlice, Dispatch, AnyAction } from '@reduxjs/toolkit';

//
import { parseISO } from 'date-fns';
// utils
import fetch from 'src/lib/fetch';
// @types
import { ICalendarState, ICalendarEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

const initialState: ICalendarState = {
  isLoading: false,
  error: null,
  events: [],
  eventsSeries: [],
  openModal: false,
  selectedEventId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload.events;
      state.eventsSeries = action.payload.eventsSeries;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const updatedEvent = action.payload;
      state.isLoading = false;
      state.events = action.payload.events;
      state.eventsSeries = action.payload.eventSeries;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const eventId = action.payload;
      state.events = state.events.filter(event => event._id !== eventId);
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.openModal = true;

      state.selectedRange = { start: parseISO(start), end: parseISO(end) };
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;

      state.openModal = true;
      state.selectedEventId = eventId;
    },

    // OPEN MODAL
    onOpenModal(state) {
      state.openModal = true;
    },

    onCloseModal(state) {
      state.openModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { onOpenModal, onCloseModal, selectEvent, selectRange } = slice.actions;

// ----------------------------------------------------------------------

export function getEvents() {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(slice.actions.startLoading());
    try {
      const collaboratorEvents = await fetch('/api/calendar/collaborators/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const collaboratorHealthUnitEvents = await fetch('/api/calendar/health-units/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const events = [...collaboratorEvents, ...collaboratorHealthUnitEvents];

      dispatch(slice.actions.getEventsSuccess({ events, eventSeries: [] }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent: ICalendarEvent) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await fetch('/api/calendar/collaborators/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      dispatch(slice.actions.createEventSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(
  eventId: string,
  event: Partial<{
    allDay: boolean;
    start: Date | string | number | null;
    end: Date | string | number | null;
    owner_type: string;
    title: string;
    description: string;
    textColor: string;
    event_series: string;
  }>
) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response;

      if (event.owner_type === 'collaborator') {
        response = await fetch(`/api/calendar/collaborators/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...event }),
        });
      }

      // Need to refetch events to update the series
      if (event.owner_type === 'health_unit') {
        // It's a series
        if (event?.event_series) {
          response = await fetch(`/api/calendar/health-units/event-series/${event.event_series}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...event }),
          });
        }

        // It's a single event
        else {
          response = await fetch(`/api/calendar/health-units/events/${eventId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...event }),
          });
        }
      }

      const collaboratorEvents = await fetch('/api/calendar/collaborators/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const collaboratorHealthUnitEvents = await fetch('/api/calendar/health-units/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const events = [...collaboratorEvents, ...collaboratorHealthUnitEvents];

      dispatch(slice.actions.updateEventSuccess({ events, eventSeries: [] }));
    } catch (error) {
      console.error('Update event error: ', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(
  eventId: string,
  event: Partial<{
    allDay: boolean;
    start: Date | string | number | null;
    end: Date | string | number | null;
    owner_type: string;
    title: string;
    description: string;
    textColor: string;
    event_series: string;
  }>
) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response;

      if (event.owner_type === 'collaborator') {
        response = await fetch(`/api/calendar/collaborators/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...event }),
        });
      }

      // Need to refetch events to update the series
      if (event.owner_type === 'health_unit') {
        // It's a series
        if (event?.event_series) {
          response = await fetch(`/api/calendar/health-units/event-series/${event.event_series}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...event }),
          });
        }

        // It's a single event
        else {
          response = await fetch(`/api/calendar/health-units/events/${eventId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...event }),
          });
        }
      }

      const collaboratorEvents = await fetch('/api/calendar/collaborators/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const collaboratorHealthUnitEvents = await fetch('/api/calendar/health-units/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const events = [...collaboratorEvents, ...collaboratorHealthUnitEvents];

      dispatch(slice.actions.updateEventSuccess({ events, eventSeries: [] }));
    } catch (error) {
      console.error('Update event error: ', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
