// react
import { useCallback, useEffect, useState } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Tab, Card, Tabs, Container, Box, Button } from '@mui/material';
// routes
import { PATHS } from 'src/routes';

// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/contexts';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';

//
import CompanyProfile from '../components/profile/CompanyAbout';
import CompanyServices from '../components/profile/CompanyServices';
import CompanyProfileCover from '../components/profile/CompanyProfileCover';

// ----------------------------------------------------------------------

export default function CompanyProfilePage({ company }) {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Companyabout');

  const [isLoading, setIsLoading] = useState(false);

  const TABS = [
    {
      value: 'Companyabout',
      label: 'Sobre',
      icon: <Iconify icon="mdi:about" />,
      component: <CompanyProfile company={company} />,
    },
    {
      value: 'Companyservices',
      label: 'Serviços',
      icon: <Iconify icon="material-symbols:medical-services" />,
      component: <CompanyServices company={company} />,
    },
  ];

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs heading="Empresa" links={[{ name: 'A Minha Empresa' }]} />

          <Card
            sx={{
              mb: 3,
              height: 280,
              position: 'relative',
            }}>
            <CompanyProfileCover
              name={company?.business_profile?.name}
              cover={company?.business_profile?.logo}
            />

            <Tabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              sx={{
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                '& .MuiTabs-flexContainer': {
                  pr: { md: 3 },
                  justifyContent: {
                    sm: 'center',
                    md: 'flex-end',
                  },
                },
              }}>
              {TABS.map(tab => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </Card>

          {TABS.map(
            tab => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
          )}
        </Container>
      )}
    </>
  );
}
