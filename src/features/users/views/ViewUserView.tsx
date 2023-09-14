// react
import { useState } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// components
import { useSettingsContext } from 'src/contexts';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
//
import UserNewViewEditForm from '../components/UserNewViewEditForm';

// ----------------------------------------------------------------------

export default function EditUserView({ services, currentUser, caregivers }) {
  const { themeStretch } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Ver Colaborador"
            links={[
              {
                name: 'Equipa',
                href: PATHS.users.root,
              },
              { name: currentUser?.name },
            ]}
          />

          <UserNewViewEditForm isView editUser={currentUser} services={services} />
        </Container>
      )}
    </>
  );
}
