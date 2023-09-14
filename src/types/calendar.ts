import { EventInput } from '@fullcalendar/core';

// ----------------------------------------------------------------------

export type ICalendarViewValue = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarEvent = {
  event_series: any;
  title: string;
  description: string;
  color: string;
  allDay: boolean;
  start: Date | string | null;
  end: Date | string | null;
  type: string;
  series: string;
};

export type ICalendarEventSeries = {
  title: string;
  description: string;
  color: string;
  allDay: boolean;
  start: Date | string | null;
  end: Date | string | null;
  type: string;
};

export type ICalendarState = {
  isLoading: boolean;
  error: Error | string | null;
  events: EventInput[];
  eventsSeries: ICalendarEventSeries[];
  openModal: boolean;
  selectedEventId: string | null;
  selectedRange: {
    start: Date | string | null;
    end: Date | string | null;
  } | null;
};
