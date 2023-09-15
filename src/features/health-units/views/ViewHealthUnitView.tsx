// react
import { useEffect, useCallback, useState } from 'react';

// @mui
import { Button, Container } from '@mui/material';
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
import HealthUnitNewViewEditForm from '../components/HealthUnitNewViewEditForm';
import ProductDetailsReview from '../components/HealthUnitDetailReviews';

// ----------------------------------------------------------------------

export default function EditUserView({ services, healthUnit }) {
  const { themeStretch } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(false);

  const [currentTab, setCurrentTab] = useState('details');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

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
                href: '',
              },
              { name: healthUnit?.business_profile.name },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:pencil" />}
                component={NextLink}
                href={PATHS.healthUnits.edit(healthUnit?._id)}>
                Edit
              </Button>
            }
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
              <HealthUnitNewViewEditForm isView editHealthUnit={healthUnit} services={services} />
            )}

            {currentTab === 'reviews' && (
              <ProductDetailsReview totalRatings={0} totalReviews={0} ratings={[]} reviews={[]} />
            )}
          </Card>
        </Container>
      )}
    </>
  );
}
