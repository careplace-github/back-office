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
import HealthUnitNewViewEditForm from '../components/HealthUnitNewViewEditForm';

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
            heading="Add Health Unit"
            links={[
              {
                name: 'Health Units',
                href: '',
              },
              { name: 'Add Health Unit' },
            ]}
          />
          <HealthUnitNewViewEditForm isNew isEdit={false} editUser={null} services={services} />
        </Container>
      )}
    </>
  );
}
