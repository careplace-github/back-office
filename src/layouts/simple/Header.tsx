// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Link, Stack, Container } from '@mui/material';
import Badge, { badgeClasses } from '@mui/material/Badge';

// components
import Logo from 'src/components/logo';
import Label from 'src/components/label';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
//
import { PATHS } from 'src/routes';
import HeaderShadow from '../components/HeaderShadow';
import { HEADER } from '../config';

// ----------------------------------------------------------------------

type Props = {
  isOffset: boolean;
};

export default function Header({ isOffset }: Props) {
  const theme = useTheme();
  const isSmUp = useResponsive('up', 'sm');

  return (
    <AppBar color="transparent" sx={{ boxShadow: 'none' }}>
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
        <Container
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {isSmUp ? (
            <Badge
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  top: 8,
                  right: -30,
                },
              }}
              badgeContent={
                <Link href="" target="_blank" rel="noopener" underline="none" sx={{ ml: 1 }}>
                  <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 1.5 }}>
                    ADMIN
                  </Label>
                </Link>
              }>
              <Logo />
            </Badge>
          ) : (
            <Logo />
          )}
          {isSmUp && (
            <Stack spacing={1} direction="row" alignItems="center">
              <Link href={PATHS.support} component={NextLink} variant="subtitle2" color="inherit">
                Precisa de Ajuda?
              </Link>
            </Stack>
          )}
        </Container>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}
