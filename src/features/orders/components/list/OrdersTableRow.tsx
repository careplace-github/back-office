import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Link,
  Stack,
  Button,
  Divider,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// auth
import { useSession } from 'next-auth/react';

// utils
import { getRecurrencyText, getScheduleText, getStatusText } from 'src/utils/orderUtils';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { CustomAvatar } from 'src/components/custom-avatar';
import MenuPopover from 'src/components/menu-popover';
import ConfirmDialog from 'src/components/confirm-dialog';

// ----------------------------------------------------------------------

PendingCustomersTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function PendingCustomersTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const { data: user } = useSession();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = event => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Typography variant="subtitle2" noWrap>
                {row.order_number}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar name={row.patient?.name} src={row.patient?.profile_picture} />

            <div>
              <Typography variant="subtitle2" noWrap>
                {row.patient?.name}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>
          {row.services.map(service => (
            <Label
              color="primary"
              sx={{
                mr: 1,
                mb: 1,
              }}>
              {service.name}{' '}
            </Label>
          ))}
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Typography variant="subtitle2" noWrap>
                {row.caregiver?.name || 'N/A'}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {getRecurrencyText(row)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: 'text.secondary', width: '230px', mr: 10 }}>
            {getScheduleText(row)}
          </Typography>
        </TableCell>

        <TableCell>
          <Label
            color={
              (row.status === 'new' && 'info') ||
              (row.status === 'accepted' && 'secondary') ||
              (row.status === 'pending_payment' && 'warning') ||
              (row.status === 'active' && 'success') ||
              (row.status === 'completed' && 'primary') ||
              (row.status === 'cancelled' && 'error') ||
              (row.status === 'declined' && 'error') ||
              'default'
            }>
            {getStatusText(row)}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}>
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}>
          <Iconify icon="eva:eye-fill" />
          Ver
        </MenuItem>

        {user?.permissions?.includes('users_edit') && (
          <>
            <MenuItem
              onClick={() => {
                onEditRow();
                handleClosePopover();
              }}>
              <Iconify icon="eva:edit-fill" />
              Editar
            </MenuItem>

            {row.type === 'external' && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                  onClick={() => {
                    handleOpenConfirm();
                    handleClosePopover();
                  }}
                  sx={{ color: 'error.main' }}>
                  <Iconify icon="eva:trash-2-outline" />
                  Eliminar
                </MenuItem>
              </>
            )}
          </>
        )}
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Eliminar Pedido"
        content={
          <Typography component="div">
            Tem a certeza que pretende eliminar o seguinte pedido: <b>{row.order_number}</b> ?
          </Typography>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              handleCloseConfirm();
            }}>
            Eliminar
          </Button>
        }
      />
    </>
  );
}
