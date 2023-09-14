import PropTypes from 'prop-types';
// @mui
import { Stack, Button, Tooltip, Typography, IconButton, CircularProgress } from '@mui/material';
// utils
import { fDate } from 'src/utils/formatTime';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Month', icon: 'ic:round-view-module' },
  { value: 'timeGridWeek', label: 'Week', icon: 'ic:round-view-week' },
  { value: 'timeGridDay', label: 'Day', icon: 'ic:round-view-day' },
  { value: 'listWeek', label: 'Agenda', icon: 'ic:round-view-agenda' },
];

// ----------------------------------------------------------------------

CalendarToolbar.propTypes = {
  onToday: PropTypes.func,
  onNextDate: PropTypes.func,
  onPrevDate: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onChangeView: PropTypes.func,
  date: PropTypes.instanceOf(Date),
  view: PropTypes.oneOf(['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek']),
  isCalendarLoading: PropTypes.bool,
};

export default function CalendarToolbar({
  date,
  view,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilter,
  isCalendarLoading,
}) {
  const isDesktop = useResponsive('up', 'sm');

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 2.5 }}>
      {isDesktop && (
        <Stack direction="row" spacing={1}>
          {VIEW_OPTIONS.map(viewOption => (
            <Tooltip key={viewOption.value} title={viewOption.label}>
              <IconButton
                size="small"
                color={viewOption.value === view ? 'primary' : 'default'}
                onClick={() => onChangeView(viewOption.value)}>
                <Iconify icon={viewOption.icon} width={20} height={20} />
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      )}

      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPrevDate}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Typography variant="h5">{fDate(date)}</Typography>

        <IconButton onClick={onNextDate}>
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </IconButton>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        {isCalendarLoading && <CircularProgress size="15px" sx={{ mr: '10px' }} />}
        {isDesktop && (
          <Button size="small" color="primary" variant="contained" onClick={onToday}>
            Hoje
          </Button>
        )}

        <IconButton onClick={onOpenFilter}>
          <Iconify icon="ic:round-filter-list" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
