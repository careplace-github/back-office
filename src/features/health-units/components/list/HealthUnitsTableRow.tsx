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
            <CustomAvatar
              type="custom"
              name={row.business_profile.name}
              src={row.business_profile.logo}
            />

            <Typography variant="subtitle2" noWrap>
              {row.business_profile.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{row.business_profile.email}</TableCell>

        <TableCell align="left">{row.business_profile.phone}</TableCell>

        <TableCell align="left">{row.addresses[0].country}</TableCell>

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
          View
        </MenuItem>

        {user?.permissions?.includes('admin') && (
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
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
