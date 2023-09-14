// next
import NextLink from 'next/link';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Stack, StackProps, Typography } from '@mui/material';

// routes
import { PATHS } from 'src/routes';
// components
import { CustomAvatar } from 'src/components/custom-avatar';
// utils
import { fRole } from 'src/utils/formatRole';
import { useSession } from 'next-auth/react';
import useSessionStorage from 'src/hooks/use-session-storage';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function NavAccount({ sx, ...other }: StackProps) {
  const { data: user } = useSession();

  // Use useSessionStorage to get and set values
  const [name, setName] = useSessionStorage('name', '');
  const [role, setRole] = useSessionStorage('role', '');
  const [healthUnitName, setHealthUnitName] = useSessionStorage('health_unit_name', '');
  const [healthUnitLogo, setHealthUnitLogo] = useSessionStorage('health_unit_logo', '');

  // Update session storage values when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRole(user.role || '');
      setHealthUnitName(user.health_unit?.business_profile?.name || '');
      setHealthUnitLogo(user.health_unit?.business_profile?.logo || '');
    }
  }, [user, setName, setRole, setHealthUnitName, setHealthUnitLogo]);

  return (
    <Stack sx={sx} {...other}>
      <Link component={NextLink} href={PATHS.account.root} underline="none" color="inherit">
        <StyledRoot>
          <CustomAvatar src={healthUnitLogo} alt={name} name={name} />

          <Box sx={{ ml: 2, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {healthUnitName}
            </Typography>

            <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
              {fRole(role)}
            </Typography>
          </Box>
        </StyledRoot>
      </Link>
    </Stack>
  );
}
