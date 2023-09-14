// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgBlur } from 'src/theme/css';
import { useSession } from 'next-auth/react';

// routes
import { PATHS } from 'src/routes';
// components
import Logo from 'src/components/logo';
import Label from 'src/components/label';
//
import { HEADER } from '../../config';
import AccountPopover from './AccountPopover';

//
import { HeaderShadow, LoginButton } from '../../components';

// ----------------------------------------------------------------------

export default function Header() {
  const { data: user } = useSession() || {};

  const session = user?._id && user?.name && user?.email;

  const theme = useTheme();

  const isSmUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_MAIN_DESKTOP,
          },
          color: 'text.primary',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
        }}>
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          {isSmUp ? (
            <Badge
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  top: 8,
                  right: -16,
                },
              }}
              badgeContent={
                <Link href="" target="_blank" rel="noopener" underline="none" sx={{ ml: 1 }}>
                  <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
                    beta
                  </Label>
                </Link>
              }>
              <Logo />
            </Badge>
          ) : (
            <Logo />
          )}

          <Box sx={{ flexGrow: 1 }} />

          {!session && (
            <Stack alignItems="center" direction="row">
              {isSmUp && (
                <Button
                  variant="contained"
                  rel="noopener"
                  href={PATHS.demo}
                  sx={{
                    mr: 1,
                  }}>
                  Registar
                </Button>
              )}

              <LoginButton />
            </Stack>
          )}

          {session && (
            <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
              <AccountPopover />
            </Stack>
          )}
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
