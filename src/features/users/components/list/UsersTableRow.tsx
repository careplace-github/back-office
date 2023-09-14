import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Button,
  Divider,
  TableRow,
  MenuItem,
  TableCell,
  Tooltip,
  IconButton,
  Typography,
} from '@mui/material';
// auth
import { useSession } from 'next-auth/react';

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import ConfirmDialog from 'src/components/confirm-dialog';
import { CustomAvatar } from 'src/components/custom-avatar';
// data
import { roles } from 'src/data';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { data: user } = useSession();

  const appAccess = row?.permissions?.includes('app_user');

  const hasAccess = row?.permissions?.includes('app_user');

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
            <CustomAvatar type="custom" name={row.name} src={row.profile_picture} />

            <Typography variant="subtitle2" noWrap>
              {row.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{row.email}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row.role && (
            <Label variant="soft" color="info" sx={{ textTransform: 'capitalize' }}>
              {roles.find(role => role.value === row.role)?.label}
            </Label>
          )}
        </TableCell>

        <TableCell align="center">
          {hasAccess && (
            <Tooltip title="Este utilizador tem acesso à plataforma." arrow>
              <Iconify
                icon={appAccess ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
                sx={{
                  width: 20,
                  height: 20,
                  color: appAccess ? 'success.main' : 'warning.main',
                }}
              />
            </Tooltip>
          )}
          {!hasAccess && (
            <Tooltip title="Este não utilizador tem acesso à plataforma." arrow>
              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                n/a
              </Typography>
            </Tooltip>
          )}
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
        sx={{ width: 140 }}>
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
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Eliminar Colaborador"
        content={
          <Typography component="div">
            Tem a certeza que pretende eliminar o seguinte colaborador: <b>{row.name}</b> ?
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
