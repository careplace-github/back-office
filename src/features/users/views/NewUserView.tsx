// next
import Head from 'next/head';
// react
import { useCallback, useEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// components
import { useSettingsContext } from 'src/contexts';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
// lib
import axios from 'src/lib/axios';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
//
import UserNewViewEditForm from '../components/UserNewViewEditForm';

// ----------------------------------------------------------------------

export default function NewUserView({ services }) {
  const { themeStretch } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Adicionar Colaborador"
            links={[
              {
                name: 'Equipa',
                href: PATHS.users.root,
              },
              { name: 'Adicionar Colaborador' },
            ]}
          />
          <UserNewViewEditForm isNew isEdit={false} editUser={null} services={services} />
        </Container>
      )}
    </>
  );
}
