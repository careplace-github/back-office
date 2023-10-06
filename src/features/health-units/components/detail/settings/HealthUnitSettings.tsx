// react
import { useState } from 'react';
// Yup
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import { ISnackbarProps } from 'src/types/snackbar';
// routes
import { useRouter } from 'next/router';
import { PATHS } from 'src/routes';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Card,
  Stack,
  Button,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// data
import { countries } from 'src/data';
// lib
import fetch from 'src/lib/fetch';
// components
import FormProvider, { RHFPhoneField, RHFTextField } from 'src/components/hook-form';
import ConfirmDialog from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function HealthUnitSettings({ healthUnit }) {
  const isMdUp = useResponsive('up', 'md');
  const theme = useTheme();
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState<ISnackbarProps>({
    show: false,
    severity: 'success',
    message: '',
  });
  const { data: user } = useSession();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [deleteAccountPopover, setDeleteAccountPopover] = useState(false);

  const handleDeleteHealthUnit = async () => {
    try {
      const response = await fetch(`/api/health-units/${healthUnit?._id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          health_unit_id: healthUnit._id,
        }),
      });

      enqueueSnackbar('Health unit deleted successfully!', { variant: 'success' });

      // push to health units list
      router.push(PATHS.healthUnits.root);
    } catch (error) {
      switch (error.code) {
        default:
          enqueueSnackbar('Error deleting health unit. Please try again.', {
            variant: 'error',
          });
          break;
      }
    }
  };

  const [stripeAccountId, setStripeAccountId] = useState(
    healthUnit?.stripe_information?.account_id || ''
  );
  const [stripeCustomerId, setStripeCustomerId] = useState(
    healthUnit?.stripe_information?.customer_id || ''
  );

  const [isAccountIdDisabled, setIsAccountIdDisabled] = useState(true);
  const [isCustomerIdDisabled, setIsCustomerIdDisabled] = useState(true);

  const [generateAccountIdPopup, setGenerateAccountIdPopup] = useState(false);
  const [generateCustomerIdPopup, setGenerateCustomerIdPopup] = useState(false);

  const [deleteAccountIdPopup, setDeleteAccountIdPopup] = useState(false);
  const [deleteCustomerIdPopup, setDeleteCustomerIdPopup] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleGenerateAccountId = async () => {
    try {
      const response = await fetch(
        `/api/payments/accounts`,

        {
          method: 'POST',
          body: JSON.stringify({
            health_unit_id: healthUnit._id,
          }),
        }
      );

      enqueueSnackbar('Account ID generated successfully!', { variant: 'success' });

      setStripeAccountId(response.data.id);
      setIsAccountIdDisabled(true);
      setGenerateAccountIdPopup(false);

      // refresh page
      router.push({
        pathname: PATHS.healthUnits.view(healthUnit._id),
        query: { tab: 'account' },
      });
    } catch (error) {
      switch (error.code) {
        default:
          enqueueSnackbar('Error generating Account ID. Please try again.', {
            variant: 'error',
          });
          break;
      }
    }
  };

  const handleDeleteAccountId = async () => {
    try {
      const response = await fetch(
        `/api/payments/accounts/${healthUnit?.stripe_information?.account_id}?health_unit_id=${healthUnit._id}`,

        {
          method: 'DELETE',
        }
      );

      enqueueSnackbar('Account ID deleted successfully!', { variant: 'success' });

      setIsAccountIdDisabled(true);
      setDeleteAccountIdPopup(false);
      setStripeAccountId('');
      // refresh page with the query tab=account
      router.push({
        pathname: PATHS.healthUnits.view(healthUnit._id),
        query: { tab: 'account' },
      });
    } catch (error) {
      switch (error.code) {
        default:
          enqueueSnackbar('Error deleting Account ID. Please try again.', {
            variant: 'error',
          });
          break;
      }
    }
  };

  const handleGenerateCustomerId = async () => {
    try {
      const response = await fetch(`/api/payments/customers`, {
        method: 'POST',
        body: JSON.stringify({
          health_unit_id: healthUnit._id,
        }),
      });

      enqueueSnackbar('Customer ID generated successfully!', { variant: 'success' });

      setStripeCustomerId(response.data.id);
      setIsCustomerIdDisabled(true);
      setGenerateCustomerIdPopup(false);

      // refresh page
      router.push({
        pathname: PATHS.healthUnits.view(healthUnit._id),
        query: { tab: 'account' },
      });
    } catch (error) {
      switch (error.code) {
        default:
          enqueueSnackbar('Error generating Customer ID. Please try again.', {
            variant: 'error',
          });
          break;
      }
    }
  };

  const handleDeleteCustomerId = async () => {
    try {
      const response = await fetch(
        `/api/payments/customers/${healthUnit?.stripe_information?.customer_id}?health_unit_id=${healthUnit._id}`,

        {
          method: 'DELETE',
        }
      );

      enqueueSnackbar('Customer ID deleted successfully!', { variant: 'success' });

      setIsCustomerIdDisabled(true);
      setDeleteCustomerIdPopup(false);
      setStripeCustomerId('');
      // refresh page with the query tab=account
      router.push({
        pathname: PATHS.healthUnits.view(healthUnit._id),
        query: { tab: 'account' },
      });
    } catch (error) {
      switch (error.code) {
        default:
          enqueueSnackbar('Error deleting Customer ID. Please try again.', {
            variant: 'error',
          });
          break;
      }
    }
  };

  return (
    <>
      <Snackbar
        open={showSnackbar.show}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() =>
          setShowSnackbar({
            show: false,
            severity: 'success',
            message: '',
          })
        }>
        <Alert
          onClose={() =>
            setShowSnackbar({
              show: false,
              severity: 'success',
              message: '',
            })
          }
          severity={showSnackbar.severity}
          sx={{ width: '100%' }}>
          {showSnackbar.message}
        </Alert>
      </Snackbar>

      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, width: '100%', textAlign: 'left' }}>
            Stripe Account
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
              <TextField
                label="Account ID ***"
                sx={{
                  width: '300px',
                }}
                value={stripeAccountId}
                disabled={isAccountIdDisabled}
                InputLabelProps={{ shrink: true }}
                // view only

                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        cursor:
                          stripeAccountId && !user?.permissions?.includes('super_admin')
                            ? 'default'
                            : 'pointer',
                      }}
                      onClick={() => {
                        if (stripeAccountId && !user?.permissions?.includes('super_admin')) return;

                        setIsAccountIdDisabled(!isAccountIdDisabled);
                      }}>
                      <Box component="span" sx={{ color: 'text.disabled={isView || isScreening}' }}>
                        {isAccountIdDisabled ? (
                          // show open lock
                          <Iconify icon="ooui:lock" color="main" />
                        ) : (
                          <Iconify icon="ooui:un-lock" color="main" />
                        )}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              {!isAccountIdDisabled && !stripeAccountId && (
                <Typography
                  onClick={() => {
                    setGenerateAccountIdPopup(true);
                  }}
                  sx={{
                    color: 'text.disabled',
                    width: 'fit-content',
                    fontSize: '12px',
                    pl: '5px',
                    pt: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}>
                  Generate Account ID
                </Typography>
              )}

              {!isAccountIdDisabled && stripeAccountId && (
                <Typography
                  onClick={() => {
                    setDeleteAccountIdPopup(true);
                  }}
                  sx={{
                    color: 'text.disabled',
                    width: 'fit-content',
                    fontSize: '12px',
                    pl: '5px',
                    pt: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}>
                  Delete Account ID
                </Typography>
              )}
            </Stack>

            <ConfirmDialog
              open={generateAccountIdPopup}
              onClose={() => {
                setGenerateAccountIdPopup(false);
              }}
              title="Generate Account ID"
              content={
                <Typography component="div">
                  Are you sure you want to generate the following field:
                  <br /> <b>Stripe Account ID</b> ? <br />
                  If you confirm the API will generate a new Account ID for the health unit with the
                  information provided on the database. <br />
                  After the Account ID is generated, <b>you will not be able to change it.</b>{' '}
                  <br />
                  <br />
                  <br />
                  Please make sure you know what you are doing.
                </Typography>
              }
              action={
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleGenerateAccountId();
                    setIsAccountIdDisabled(false);
                    setGenerateAccountIdPopup(false);
                  }}>
                  Generate Account ID
                </Button>
              }
            />

            <ConfirmDialog
              open={deleteAccountIdPopup}
              onClose={() => {
                setDeleteAccountIdPopup(false);
              }}
              title="Delete Account ID"
              content={
                <Typography component="div">
                  Are you sure you want to delete the following field:
                  <br /> <b>Stripe Account ID</b> ? <br />
                  If you confirm the API will <b>delete the Account ID </b>for the health unit.{' '}
                  <br />
                  After the Account ID is deleted the health unit will,{' '}
                  <b>NOT be able to receive payments.</b> <br />
                  <br />
                  <br />
                  Please make sure you know what you are doing.
                </Typography>
              }
              action={
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleDeleteAccountId();
                    setIsAccountIdDisabled(false);
                    setDeleteAccountIdPopup(false);
                  }}>
                  Delete Account ID
                </Button>
              }
            />

            <Box sx={{ ml: '20px' }}>
              <TextField
                sx={{ width: '300px' }}
                label="Customer ID"
                value={stripeCustomerId}
                disabled={isCustomerIdDisabled}
                InputLabelProps={{ shrink: true }}
                // view only

                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        cursor:
                          stripeCustomerId && !user?.permissions?.includes('super_admin')
                            ? 'default'
                            : 'pointer',
                      }}
                      onClick={() => {
                        if (stripeCustomerId && !user?.permissions?.includes('super_admin')) return;

                        setIsCustomerIdDisabled(!isCustomerIdDisabled);
                      }}>
                      <Box component="span" sx={{ color: 'text.disabled={isView || isScreening}' }}>
                        {isCustomerIdDisabled ? (
                          // show open lock
                          <Iconify icon="ooui:lock" color="main" />
                        ) : (
                          <Iconify icon="ooui:un-lock" color="main" />
                        )}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              {!isCustomerIdDisabled && !stripeCustomerId && (
                <Typography
                  onClick={() => setGenerateCustomerIdPopup(true)}
                  sx={{
                    color: 'text.disabled',
                    width: 'fit-content',
                    fontSize: '12px',
                    pl: '5px',
                    pt: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}>
                  Generate Customer ID
                </Typography>
              )}

              {!isCustomerIdDisabled && stripeCustomerId && (
                <Typography
                  onClick={() => {
                    setDeleteCustomerIdPopup(true);
                  }}
                  sx={{
                    color: 'text.disabled',
                    width: 'fit-content',
                    fontSize: '12px',
                    pl: '5px',
                    pt: '5px',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}>
                  Delete Customer ID
                </Typography>
              )}
            </Box>

            <ConfirmDialog
              open={generateCustomerIdPopup}
              onClose={() => {
                setGenerateCustomerIdPopup(false);
              }}
              title="Generate Customer ID"
              content={
                <Typography component="div">
                  Are you sure you want to generate the following field:
                  <br /> <b>Stripe Customer ID</b> ? <br />
                  If you confirm the API will generate a new Customer ID for the health unit with
                  the information provided on the database. <br />
                  After the Customer ID is generated, <b>you will not be able to change it.</b>{' '}
                  <br />
                  <br />
                  Please make sure you know what you are doing.
                </Typography>
              }
              action={
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleGenerateCustomerId();
                    setIsAccountIdDisabled(false);
                    setGenerateAccountIdPopup(false);
                  }}>
                  Generate Customer ID
                </Button>
              }
            />

            <ConfirmDialog
              open={deleteCustomerIdPopup}
              onClose={() => {
                setDeleteAccountIdPopup(false);
              }}
              title="Delete Customer ID"
              content={
                <Typography component="div">
                  Are you sure you want to delete the following field:
                  <br /> <b>Stripe Customer ID</b> ? <br />
                  If you confirm the API will <b>delete the Customer ID </b>for the health unit.{' '}
                  <br />
                  After the Customer ID is deleted the health unit will,{' '}
                  <b>NOT be able to receive payments.</b> <br />
                  <br />
                  <br />
                  Please make sure you know what you are doing.
                </Typography>
              }
              action={
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleDeleteCustomerId();
                    setIsCustomerIdDisabled(false);
                    setDeleteCustomerIdPopup(false);
                  }}>
                  Delete Customer ID
                </Button>
              }
            />
          </Box>
        </Stack>

        {user?.permissions?.includes('super_admin') && (
          <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, width: '100%', textAlign: 'left' }}>
              Delete Account
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <LoadingButton
                sx={{
                  width: isMdUp ? 'auto' : '100%',
                  backgroundColor: 'error',
                  mt: '-5px',
                }}
                color="error"
                size="large"
                variant="contained"
                loading={isSubmitting}
                onClick={() => {
                  setDeleteAccountPopover(true);
                }}>
                Delete Account
              </LoadingButton>

              <ConfirmDialog
                open={deleteAccountPopover}
                onClose={() => {
                  setDeleteAccountPopover(false);
                }}
                title="Delete Account"
                content={
                  <Typography component="div">
                    Are you sure you want to delete the following health unit:
                    <br /> <b>{healthUnit?.business_profile?.name}</b> ? <br />
                    This action cannot be undone.
                    <br />
                    <br />
                    Please make sure you know what you are doing.
                  </Typography>
                }
                action={
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      handleDeleteHealthUnit();
                      setDeleteAccountPopover(false);
                    }}>
                    Delete
                  </Button>
                }
              />
            </Box>
          </Stack>
        )}
      </Card>
    </>
  );
}
