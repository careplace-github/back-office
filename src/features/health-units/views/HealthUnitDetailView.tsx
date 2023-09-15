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

//
<<<<<<< Updated upstream:src/features/health-units/views/ViewHealthUnitView.tsx
import HealthUnitNewViewEditForm from '../components/HealthUnitNewViewEditForm';
import ProductDetailsReview from '../components/HealthUnitDetailReviews';
import Iconify from 'src/components/iconify';
=======
import HealthUnitNewViewEditForm from '../components/HealthUnitDetailForm';
import HealthUnitDetailsReview from '../components/HealthUnitDetailReviews';
>>>>>>> Stashed changes:src/features/health-units/views/HealthUnitDetailView.tsx

// ----------------------------------------------------------------------

export default function EditUserView({ services, healthUnit, reviews }) {
  const { themeStretch } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(false);

  const [currentTab, setCurrentTab] = useState('details');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

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
              { name: healthUnit?.business_profile.name },
            ]}
          />

          <Card>
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              sx={{
                px: 3,
                boxShadow: theme => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}>
              {[
                {
                  value: 'details',
                  label: 'Details',
                },
                {
                  value: 'orders',
                  label: 'Orders',
                },
                {
                  value: 'users',
                  label: 'Users',
                },
                {
                  value: 'reviews',
                  label: `Reviews`,
                },
              ].map(tab => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            {currentTab === 'details' && (
              <HealthUnitNewViewEditForm isEdit editHealthUnit={healthUnit} services={services} />
            )}

<<<<<<< Updated upstream:src/features/health-units/views/ViewHealthUnitView.tsx
            {currentTab === 'reviews' && <ProductDetailsReview totalRatings={0} totalReviews={0} ratings={[]} reviews={[]} />}
=======
            {currentTab === 'reviews' && (
              <HealthUnitDetailsReview  totalReviews={healthUnit.rating.count} reviews={reviews} ratings={healthUnit.rating.count_stars} averageRating={healthUnit.rating.average} />
            )}
>>>>>>> Stashed changes:src/features/health-units/views/HealthUnitDetailView.tsx
          </Card>
        </Container>
      )}
    </>
  );
}
