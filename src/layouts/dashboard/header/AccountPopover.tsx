'use client';

import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// auth
import fetch from 'src/lib/axios';
import { signOut, useSession } from 'next-auth/react';
// routes
import { PATHS } from 'src/routes';
// components
import Iconify from 'src/components/iconify';
import { CustomAvatar } from 'src/components/custom-avatar';
import { useSnackbar } from 'src/components/snackbar';
import MenuPopover from 'src/components/menu-popover';
import { IconButtonAnimate } from 'src/components/animate';
// hooks
import useSessionStorage from 'src/hooks/use-session-storage';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
    icon: 'mdi:house-outline',
  },
  {
    label: 'Settings',
    linkTo: PATHS.account.settings,
    icon: 'material-symbols:settings-outline-rounded',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { data: user } = useSession();

  // Use useSessionStorage to get and set values
  const [profilePicture, setProfilePicture] = useSessionStorage('picture', '');
  const [name, setName] = useSessionStorage('name', '');
  const [email, setEmail] = useSessionStorage('email', '');

  // Update session storage values when user data changes
  useEffect(() => {
    if (user) {
      setProfilePicture(user.picture || '');
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, setProfilePicture, setName, setEmail]);

  const { replace, push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const logout = async () => {
    fetch('/api/auth/logout', {
      method: 'POST',
    });
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      // logout();
      await signOut();
      replace(PATHS.auth.login);
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path: string) => {
    handleClosePopover();
    push(path);
  };

  return (
    <>
      <IconButtonAnimate
        disableAnimation
        disableRipple
        onClick={handleOpenPopover}
        sx={{
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            cursor: 'pointer',
          }}>
          <CustomAvatar src={profilePicture} alt={name} name={name} type="custom" />

          <Iconify
            icon="ic:baseline-keyboard-arrow-down"
            width="30px"
            sx={
              openPopover
                ? { ml: '-15px', transform: 'rotate(180deg)', transition: '500ms' }
                : { ml: '-15px', transform: 'rotate(0deg)', transition: '500ms' }
            }
          />
        </Box>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: '300px', p: 0 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>

          <Typography variant="body2" sx={{ color: '#212B36' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map(option => (
            <MenuItem
              key={option.label}
              sx={{
                pt: '12px',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: '5px',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
              onClick={() => handleClickItem(option.linkTo)}>
              <Iconify icon={option.icon} color="#212B36" />
              <Typography variant="body2" sx={{ color: '#212B36' }} noWrap>
                {option.label}
              </Typography>
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1, color: '#212B36' }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
