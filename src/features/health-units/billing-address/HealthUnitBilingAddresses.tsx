import React, { useCallback, useState, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Typography, Box, CircularProgress, Popover } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import EmptyState from 'src/components/empty-state/EmptyState';
//
import NewBillingAddressForm from './NewBillingAddressForm';
import HealthUnitBillinAddressItem from './HealthUnitBillingAddressItem';

// ----------------------------------------------------------------------

type Props = {
  addressBook: any[];
  legalInformation: any;
  handleAddNewAddress: (address: any) => void;
  onDeleteAddress: (id: string) => void;
  onSetPrimaryAddress: (id: string) => void;
  isLoading: boolean;
  handleUpdateAddress: (address: any) => void;
};

export default function HealthUnitBillingAddresses({
  addressBook,
  legalInformation,
  handleAddNewAddress,
  handleUpdateAddress,
  onDeleteAddress,
  onSetPrimaryAddress,
  isLoading,
}: Props) {
  const [addressId, setAddressId] = useState('');
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [adressToEdit, setAdressToEdit] = useState<any>();
  const [openAddNewBillingAddress, setOpenAddNewBillingAddress] = useState<{
    show: boolean;
    address: any;
  }>({ show: false, address: null });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenOptions(true);
  };

  useEffect(() => {
    console.log(openAddNewBillingAddress);
  }, [openAddNewBillingAddress]);

  const handleClose = () => {
    setOpenOptions(false);
    setAddressId('');
    setAnchorEl(null);
  };

  const handleSelectedId = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAddressId(id);
  };
  return (
    <>
      <Stack
        direction="row"
        sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Billing Addresses</Typography>
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenAddNewBillingAddress({ show: true, address: null })}>
          Address
        </Button>
      </Stack>

      <Stack spacing={2.5} sx={{ my: 5 }}>
        {addressBook?.length > 0 && !isLoading ? (
          addressBook
            ?.sort((a, b) => {
              if (a.primary) return -1; // Move primary === true to the front
              if (b.primary) return 1;
              return 0; // Leave the order of other elements unchanged
            })
            .map((address, index) => (
              <HealthUnitBillinAddressItem
                legalInformation={legalInformation}
                variant="outlined"
                key={address.id}
                address={address}
                action={
                  <IconButton
                    onClick={(event: any) => {
                      handleClick(event);
                      handleSelectedId(event, `${address._id}`);
                    }}
                    sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                }
                sx={{
                  p: 2.5,
                  borderRadius: 1,
                }}
              />
            ))
        ) : addressBook?.length === 0 && !isLoading ? (
          <EmptyState
            icon="mingcute:paper-line"
            title="This Health Unit has no billing addresses"
            description="Please note that for this health unit to be able to receive payments, it need to have at least one billing address added."
          />
        ) : (
          <Box
            sx={{
              minHeight: '400px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CircularProgress />
          </Box>
        )}
      </Stack>
      <Popover
        id={addressId}
        open={openOptions}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <MenuItem
          disabled={addressBook?.find(a => a._id === addressId)?.primary}
          sx={{ p: '10px 20px' }}
          onClick={async () => {
            await onSetPrimaryAddress(addressId);
            handleClose();
          }}>
          <Iconify icon="eva:star-fill" sx={{ mr: '7px' }} />
          Set as primary
        </MenuItem>

        <MenuItem
          sx={{ p: '10px 20px' }}
          onClick={() => {
            handleClose();
            console.info('EDIT', addressId);
            const editAddress = addressBook?.find(a => a._id === addressId);
            setOpenAddNewBillingAddress({ show: true, address: editAddress });
          }}>
          <Iconify icon="solar:pen-bold" sx={{ mr: '7px' }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            console.info('DELETE', addressId);
            onDeleteAddress(addressId);
          }}
          sx={{ color: 'error.main', p: '10px 20px' }}>
          <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: '7px' }} />
          Delete
        </MenuItem>
      </Popover>

      <NewBillingAddressForm
        open={openAddNewBillingAddress.show}
        forcePrimary={addressBook?.length === 0}
        onClose={() => {
          setOpenAddNewBillingAddress({ show: false, address: null });
        }}
        legalInformation={legalInformation}
        onCreate={handleAddNewAddress}
        addressToEdit={openAddNewBillingAddress.address}
        onUpdate={handleUpdateAddress}
      />
    </>
  );
}
