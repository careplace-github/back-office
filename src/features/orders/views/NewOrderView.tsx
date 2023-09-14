// @mui
import { Container } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// components
import { useSettingsContext } from 'src/contexts';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSession } from 'next-auth/react';
//
import NewOrderForm from '../components/NewOrderForm';

// ----------------------------------------------------------------------

export default function NewOrderView({ services, caregivers, customers, patients }) {
  const { data: user } = useSession();

  const { themeStretch } = useSettingsContext();

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Novo Pedido"
        links={[
          {
            name: 'Pedidos',
            href: PATHS.orders.root,
          },
        ]}
      />
      <NewOrderForm
        patients={patients}
        services={services}
        caregivers={caregivers}
        customers={customers}
      />
    </Container>
  );
}
