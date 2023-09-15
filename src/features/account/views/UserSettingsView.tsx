import { useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { Container, Tab, Tabs, Box } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// layouts
import DashboardLayout from 'src/layouts/compact';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/contexts';
// sections
import {
  AccountGeneral,
  AccountNotifications,
  AccountChangePassword,
  AccountSettings,
} from '../components';

// ----------------------------------------------------------------------

export default function UserSettingstView({ user }) {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const TABS = [
    {
      value: 'general',
      label: 'Profile',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral user={user} />,
    },

    {
      value: 'change_password',
      label: 'Change Password',
      icon: <Iconify icon="ic:round-vpn-key" />,
      component: <AccountChangePassword />,
    },

    {
      value: 'account_settings',
      label: 'Account Settings',
      icon: <Iconify icon="ic:round-settings" />,
      component: <AccountSettings />,
    },
  ];

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Account Settings"
          links={[{ name: 'Account' }, { name: 'Settings' }]}
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
  );
}
