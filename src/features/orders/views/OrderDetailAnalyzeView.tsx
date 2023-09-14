import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { Button, Container, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
// routes
import { PATHS } from 'src/routes';
import { useSession } from 'next-auth/react';

// components
import { useSettingsContext } from 'src/contexts';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
// hooks
import useSessionStorage from 'src/hooks/use-session-storage';
// utils
import { getRecurrencyText, getScheduleText, getStatusText } from 'src/utils/orderUtils';
// lib
import axios from 'src/lib/axios';
//
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

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Ver Pedido"
            links={[
              {
                name: 'Pedidos',
                href: PATHS.orders.root,
              },
              { name: currentOrder?.order_number },
            ]}
            action={
              permissions.includes('orders_edit') && (
                <Button
                  variant="contained"
                  component={NextLink}
                  href={PATHS.orders.edit(currentOrder?._id)}>
                  Editar
                </Button>
              )
            }
          />
          <OrderDetailForm
            isView
            currentOrder={currentOrder}
            services={services}
            caregivers={caregivers}
          />
        </Container>
      )}
    </>
  );
}
