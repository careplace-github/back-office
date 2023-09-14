import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Stack, Drawer, Link } from '@mui/material';
import Badge, { badgeClasses } from '@mui/material/Badge';

// config
import { NAV } from 'src/layouts/config';
// components
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';
import Label from 'src/components/label';

// hooks
import useResponsive from 'src/hooks/useResponsive';
//
import navConfig from './config-navigation';
import NavAccount from './NavAccount';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { pathname } = useRouter();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}>
      <Stack
        spacing={8}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}>
        <Badge
          sx={{
            [`& .${badgeClasses.badge}`]: {
              top: 8,
              right: 15,
            },
          }}
          badgeContent={
            <Link href="" target="_blank" rel="noopener" underline="none" sx={{ ml: -7 }}>
              <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
                ADMIN
              </Label>
            </Link>
          }>
          <Logo height={33} />
        </Badge>

        <NavAccount sx={{ mt: 5 }} />
      </Stack>

      <NavSectionVertical data={navConfig} sx={{ mt: -2 }} />

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}>
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              zIndex: 0,
              width: NAV.W_DASHBOARD,
              bgcolor: 'transparent',
              borderRightStyle: 'dashed',
            },
          }}>
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}>
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
