import { useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { Container, Tab, Tabs, Box } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// contexts
import { useSettingsContext } from 'src/contexts';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CompanyAccountBilling from '../components/account/billing/CompanyAccountBilling';
import CompanyAccountGeneral from '../components/account/CompanyAccountGeneral';

// --------------------------------------------------------------------------------------------------------------------------------------------

export default function CompanySettingsView({ company, services }) {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('billing');

  const TABS = [
    /**
     *  {
      value: 'general',
      label: 'Empresa',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <CompanyAccountGeneral company={company} services={services}/>,
    },
     */

    {
      value: 'billing',
      label: 'Faturação',
      icon: <Iconify icon="ic:round-receipt" />,
      component: <CompanyAccountBilling company={company} />,
    },
  ];

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Definições de Empresa"
          links={[{ name: 'Empresa', href: PATHS.company.root }, { name: 'Definições' }]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map(tab => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          tab =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
