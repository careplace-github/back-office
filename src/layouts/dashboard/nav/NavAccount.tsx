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
  const [picture, setPicture] = useSessionStorage('picture', '');

  // Update session storage values when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user, setName]);

  return (
    <Stack sx={sx} {...other}>
      <Link component={NextLink} href={PATHS.account.root} underline="none" color="inherit">
        <StyledRoot>
          <CustomAvatar src={picture} alt={name} name={name} />

          <Box sx={{ ml: 2, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>

            <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
              {'Admin'}
            </Typography>
          </Box>
        </StyledRoot>
      </Link>
    </Stack>
  );
}
