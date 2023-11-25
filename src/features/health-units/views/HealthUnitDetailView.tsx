// react
import { useEffect, useCallback, useState } from 'react';
// @mui
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Modal } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// routes
import { PATHS } from 'src/routes';
// components
import { useSettingsContext } from 'src/contexts';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Iconify from 'src/components/iconify';
import Card from '@mui/material/Card';
import { alpha } from '@mui/material/styles';
// lib
import fetch from 'src/lib/fetch';
//
import HealthUnitNewViewEditForm from '../components/detail/HealthUnitDetailForm';
import HealthUnitDetailsReview from '../components/detail/reviews/HealthUnitDetailReviewsSummary';
import HealthUnitSettings from '../components/detail/settings/HealthUnitSettings';
import UserNewEditForm from '../components/UserNewEditForm';

// ----------------------------------------------------------------------

export default function EditUserView({ services, healthUnit, reviews }) {
  const { themeStretch } = useSettingsContext();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [currentTab, setCurrentTab] = useState(
    router.query.tab ? router.query.tab.toString() : 'details'
    // check if there is a tab in the query string
  );

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
            action={
              <Stack
                direction="row"
                gap="3px"
                alignItems="center"
                sx={{ cursor: 'pointer', pt: 5 }}
                onClick={() => {
                  window.history.back();
                }}>
                <Iconify icon="material-symbols:arrow-back-rounded" color="#212B36" />
                <Typography>Back</Typography>
              </Stack>
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
                  value: 'patients',
                  label: 'Patients',
                },
                {
                  value: 'reviews',
                  label: `Reviews`,
                },
                {
                  value: 'dashboard',
                  label: 'Dashboard',
                },
                {
                  value: 'account',
                  label: 'Account',
                },
                {
                  value: 'newCollaborator',
                  label: 'Add Collaborator',
                },
              ].map(tab => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            {currentTab === 'details' && (
              <HealthUnitNewViewEditForm isEdit healthUnit={healthUnit} services={services} />
            )}

            {currentTab === 'newCollaborator' && (
              <UserNewEditForm services={services} healthUnitId={healthUnit._id} />
            )}

            {currentTab === 'reviews' && (
              <HealthUnitDetailsReview
                healthUnitId={healthUnit._id}
                totalReviews={healthUnit.rating.count}
                reviews={reviews}
                ratings={healthUnit.rating.count_stars}
                averageRating={healthUnit.rating.average}
              />
            )}

            {currentTab === 'account' && <HealthUnitSettings healthUnit={healthUnit} />}
          </Card>
        </Container>
      )}
    </>
  );
}
