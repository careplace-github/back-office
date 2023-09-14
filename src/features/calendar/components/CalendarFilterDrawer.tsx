import { ReactNode, useEffect } from 'react';

import orderBy from 'lodash/orderBy';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Stack,
  Drawer,
  Divider,
  Tooltip,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  ListItemButton,
  Checkbox,
} from '@mui/material';
// config
import { NAV } from 'src/layouts/config';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSession } from 'next-auth/react';
// utils
import { fDateTime } from 'src/utils/formatTime';
import { EventInput } from '@fullcalendar/core';

// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ColorMultiPicker } from 'src/components/color-utils';
import { DateRangePickerProps } from 'src/components/date-range-picker';
import AvatarDropdown from 'src/components/avatar-dropdown';
import { ICaregiverProps } from 'src/types/caregiver';
import useSessionStorage from 'src/hooks/use-session-storage';

// ----------------------------------------------------------------------

type Props = {
  caregivers: any;
  openFilter: boolean;
  events: EventInput[];
  onResetFilter: VoidFunction;
  onCloseFilter: VoidFunction;
  colorOptions: string[];
  filterEventColor: string[];
  picker: DateRangePickerProps;
  onSelectEvent: (eventId: string) => void;
  onFilterEventColor: (eventColor: string) => void;
  filterEventType: string[];
  onFilterEventType: (eventType: string) => void;
  onSelectedCaregiver: (event: SelectChangeEvent<string>, child: ReactNode) => void;
  selectedCaregiver: ICaregiverProps | undefined;
};

export default function CalendarFilterDrawer({
  events,
  picker,
  openFilter,
  colorOptions,
  onCloseFilter,
  onResetFilter,
  onSelectEvent,
  filterEventColor,
  onFilterEventColor,
  caregivers,
  filterEventType,
  onFilterEventType,
  onSelectedCaregiver,
  selectedCaregiver,
}: Props) {
  const notDefault = (picker.startDate && picker.endDate) || !!filterEventColor.length;

  const { data: user } = useSession();

  const [permissions, setPermissions] = useSessionStorage('permissions', '');

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
    }
  }, [user, setPermissions]);

  return (
    <Drawer
      anchor="right"
      open={openFilter}
      onClose={onCloseFilter}
      BackdropProps={{
        invisible: true,
      }}
      PaperProps={{
        sx: { width: 320 },
      }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pl: 2, pr: 1, py: 2 }}>
        <Typography variant="subtitle1">Filtros</Typography>

        <Tooltip title="Reset">
          <Box sx={{ position: 'relative' }}>
            <IconButton onClick={onResetFilter}>
              <Iconify icon="ic:round-refresh" />
            </IconButton>

            {notDefault && (
              <Box
                sx={{
                  top: 6,
                  right: 4,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  position: 'absolute',
                  bgcolor: 'error.main',
                }}
              />
            )}
          </Box>
        </Tooltip>
      </Stack>

      <Divider />

      <Typography
        variant="caption"
        sx={{
          p: 2,
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
        }}>
        Intervalo
      </Typography>

      <Stack spacing={2} sx={{ px: 2 }}>
        <DatePicker
          label="Data de início"
          value={picker.startDate}
          onChange={picker.onChangeStartDate}
        />

        <DatePicker label="Data de fim" value={picker.endDate} onChange={picker.onChangeEndDate} />
      </Stack>

      {permissions.includes('calendar_view') && (
        <>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 'fontWeightMedium',
              p: theme => theme.spacing(2, 2, 1, 2),
            }}>
            Tipo
          </Typography>
          <Stack sx={{ ml: -0.5 }}>
            <ListItemButton onClick={() => onFilterEventType('health_unit')}>
              <Checkbox checked={filterEventType.includes('health_unit')} />
              <ListItemText primary="Empresa" />
            </ListItemButton>

            <ListItemButton onClick={() => onFilterEventType('collaborator')}>
              <Checkbox checked={filterEventType.includes('collaborator')} />
              <ListItemText primary="Pessoal" />
            </ListItemButton>
          </Stack>
        </>
      )}

      {permissions.includes('calendar_view') && (
        <>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 'fontWeightMedium',
              p: theme => theme.spacing(2, 2, 1, 2),
            }}>
            Cuidador
          </Typography>

          <Box sx={{ minWidth: 120, ml: 2, mr: 2 }}>
            <AvatarDropdown
              onChange={onSelectedCaregiver}
              selected={JSON.stringify(selectedCaregiver)}
              options={caregivers}
              emptyText="Nenhum cuidador encontrado"
              selectText="Selecione um cuidador"
            />
          </Box>
        </>
      )}

      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
          p: theme => theme.spacing(2, 2, 1, 2),
        }}>
        Cores
      </Typography>

      <ColorMultiPicker
        colors={colorOptions}
        selected={filterEventColor}
        onChangeColor={onFilterEventColor}
        sx={{ mx: 2 }}
      />

      <Typography
        variant="caption"
        sx={{
          p: 2,
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
        }}>
        Eventos ({events.length})
      </Typography>

      <Scrollbar sx={{ height: 1 }}>
        {orderBy(events, ['end'], ['desc']).map(event => (
          <ListItemButton
            key={event.id}
            onClick={() => onSelectEvent(event.id as string)}
            sx={{ py: 1.5, borderBottom: theme => `dashed 1px ${theme.palette.divider}` }}>
            <Box
              sx={{
                top: 16,
                left: 0,
                width: 0,
                height: 0,
                position: 'absolute',
                borderRight: '10px solid transparent',
                borderTop: `10px solid ${event.color}`,
              }}
            />

            <ListItemText
              disableTypography
              primary={
                <Typography variant="subtitle2" sx={{ fontSize: 13, mt: 0.5 }}>
                  {event.title}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ fontSize: 11, color: 'text.disabled' }}>
                  {event.allDay ? (
                    fDateTime(event.start as Date, 'dd MMM yy')
                  ) : (
                    <>
                      {`${fDateTime(event.start as Date, 'dd MMM yy p')} - ${fDateTime(
                        event.end as Date,
                        'dd MMM yy p'
                      )}`}
                    </>
                  )}
                </Typography>
              }
              sx={{ display: 'flex', flexDirection: 'column-reverse' }}
            />
          </ListItemButton>
        ))}
      </Scrollbar>
    </Drawer>
  );
}
