// react
import { useEffect, useCallback, useState } from 'react';

// @mui
import { Button, Container } from '@mui/material';
import { Modal } from '@mui/material';
import NextLink from 'next/link';
// routes
import { PATHS } from 'src/routes';
// components
import { useSettingsContext } from 'src/contexts';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Card from '@mui/material/Card';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

//
import HealthUnitNewViewEditForm from '../components/detail/HealthUnitDetailForm';
import HealthUnitDetailsReview from '../components/detail/reviews/HealthUnitDetailReviewsSummary';

// ----------------------------------------------------------------------

export default function EditUserView({ services }) {
  const { themeStretch } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Health Unit"
            links={[
              {
                name: 'Health Units',
                href: PATHS.healthUnits.root,
              },
              { name: 'New' },
            ]}
          />

          <Card>
            <HealthUnitNewViewEditForm isNew services={services} />
          </Card>
        </Container>
      )}
    </>
  );
}
