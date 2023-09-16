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
import HealthUnitNewViewEditForm from '../components/HealthUnitDetailForm';
import HealthUnitDetailsReview from '../components/HealthUnitDetailReviews';

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
                  value: 'patients',
                  label: 'Patients',
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
              <HealthUnitNewViewEditForm isEdit currentHealthUnit={healthUnit} services={services} />
            )}

            {currentTab === 'reviews' && (
              <HealthUnitDetailsReview
                totalReviews={healthUnit.rating.count}
                reviews={reviews}
                ratings={healthUnit.rating.count_stars}
                averageRating={healthUnit.rating.average}
              />
            )}
          </Card>
        </Container>
      )}
    </>
  );
}
