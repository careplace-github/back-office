import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// utils
import { bgBlur } from 'src/utils/cssStyles';

// components
import Image from 'src/components/image';
import { CustomAvatar } from 'src/components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.darker,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

ProfileCover.propTypes = {
  cover: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
};

export default function ProfileCover({ name, cover }) {
  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
          src={cover}
          alt={name}
          name={name}
          sx={{
            mx: 'auto',
            '& .MuiAvatar-img': {
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
            },
            image: {
              maxWidth: '100%',
              maxHeight: '100%',
              display: 'block',
            },

            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#DFE3E8',
            bgcolor: '#ffffff',
            color: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        />

        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}>
          <Typography variant="h4">{name}</Typography>
        </Box>
      </StyledInfo>

      <Image
        alt="cover"
        src={cover}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        }}
      />
    </StyledRoot>
  );
}
