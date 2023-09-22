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
import { Tooltip as MuiTooltip } from '@mui/material';

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

            <Typography
              variant="subtitle2"
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              noWrap
              onClick={() => {
                onViewRow();
              }}>
              {row.business_profile.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{row.business_profile.email}</TableCell>

        <TableCell align="left">{row.business_profile.phone}</TableCell>

        <TableCell align="left">{row?.legal_information?.address?.country}</TableCell>

        <TableCell align="center">
          <MuiTooltip
            title={
              row?.stripe_account?.requirements?.currently_due?.length > 0 ||
              !row?.stripe_information?.account_id
                ? "Stripe account is restricted. Health Unit can't receive payments. Click here to go to Stripe's account page and provide the missing information."
                : "Stripe account is enabled. Health Unit can receive payments. Click here to go to Stripe's account page."
            }
            placement="top"
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => {
              // send to stripe account page
              if (process.env.NEXT_PUBLIC_ENV === 'dev' || process.env.NEXT_PUBLIC_ENV === 'stag') {
                window.open(
                  `https://dashboard.stripe.com/test/connect/accounts/${row?.stripe_information?.account_id}`,
                  '_blank'
                );
              } else {
                window.open(
                  `https://dashboard.stripe.com/connect/accounts/${row?.stripe_information?.account_id}`,
                  '_blank'
                );
              }
            }}>
            {row?.stripe_account?.requirements?.currently_due?.length > 0 ||
            !row?.stripe_information?.account_id ? (
              <Iconify
                icon="fluent:prohibited-28-filled"
                color="error"
                width={24}
                height={24}
                sx={{
                  cursor: 'pointer',
                  color: 'error.main',
                }}
              />
            ) : (
              <Iconify
                icon="fluent:checkmark-12-filled"
                color="success"
                width={24}
                height={24}
                sx={{
                  cursor: 'pointer',
                  color: 'success.main',
                }}
              />
            )}
          </MuiTooltip>
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
          View
        </MenuItem>
        {user?.permissions?.includes('super_admin') && (
          <>
            <Divider />
            <MenuItem
              onClick={() => {
                handleClosePopover();
                setOpenConfirm(true);
              }}
              sx={{ color: 'error.main' }}>
              <Iconify icon="eva:trash-2-outline" />
              Delete
            </MenuItem>
          </>
        )}
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete Health Unit"
        content={
          <Typography component="div">
            Are you sure you want to delete the following health unit:{' '}
            <b>{row.business_profile.name}</b> ? <br />
            This action cannot be undone.
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
            Delete
          </Button>
        }
      />
    </>
  );
}
