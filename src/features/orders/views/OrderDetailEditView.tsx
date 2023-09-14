import { useEffect, useState } from 'react';
// @mui
import { Button, Container, Stack } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
import NextLink from 'next/link';
// components
import { useSettingsContext } from 'src/contexts';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import Label from 'src/components/label';
import { useSession } from 'next-auth/react';
import useSessionStorage from 'src/hooks/use-session-storage';

// lib
import axios from 'src/lib/axios';
// utils
import { getRecurrencyText, getScheduleText, getStatusText } from 'src/utils/orderUtils';
//
import Iconify from 'src/components/iconify';
import ConfirmDialog from 'src/components/confirm-dialog';
import { useSnackbar } from 'src/components/snackbar';
import OrderDetailForm from '../components/OrderDetailForm';

// ----------------------------------------------------------------------

export default function OrderDetailView({ order, services, caregivers }) {
  const { data: user } = useSession();

  const [permissions, setPermissions] = useSessionStorage('permissions', '');

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
    }
  }, [user, setPermissions]);

  const { themeStretch } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(false);
  const currentOrder = order;

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteOrder = async id => {
    try {
      await fetch(`/api/orders/home-care/${id}`, {
        method: 'DELETE',
      });
      enqueueSnackbar('Pedido eliminado com sucesso!', { variant: 'success' });

      window.location.href = PATHS.orders.root;
    } catch (error) {
      enqueueSnackbar('Erro ao eliminar pedido. Por favor tente novamente.', { variant: 'error' });
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Editar Pedido"
            links={[
              {
                name: 'Pedidos',
                href: PATHS.orders.root,
              },
              { name: currentOrder?.order_number },
            ]}
            action={
              permissions.includes('orders_edit') &&
              order.type === 'external' && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleOpenConfirm}
                  sx={{}}
                  startIcon={<Iconify icon="mdi:delete-outline" />}>
                  Eliminar
                </Button>
              )
            }
          />
          <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content={
              <>
                Tem a certeza que pretende eliminar o seguinte pedido:
                <br />
                <strong> {order.order_number} </strong> ?
              </>
            }
            action={
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDeleteOrder(order._id);
                  handleCloseConfirm();
                }}>
                Eliminar
              </Button>
            }
          />
          <OrderDetailForm
            isEdit
            currentOrder={currentOrder}
            services={services}
            caregivers={caregivers}
          />
        </Container>
      )}
    </>
  );
}
