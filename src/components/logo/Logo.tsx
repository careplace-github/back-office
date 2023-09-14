// react
import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Box, BoxProps, Link } from '@mui/material';

// ----------------------------------------------------------------------

interface LogoProps extends BoxProps {
  single?: boolean;
  disabledLink?: boolean;
  height?: any;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, single = false, sx, height, ...other }, ref) => {
    const singleLogo = (
      <Box
        component="img"
        src="/logo/careplace-icon.svg"
        sx={{ ...sx, width: height || 55, cursor: 'pointer' }}
      />
    );
    // height: { xs: 60, sm: 85, md: 40 }
    const fullLogo = (
      <Box
        component="img"
        src="/logo/careplace-logo.svg"
        sx={{ ...sx, height: height || 40, cursor: 'pointer' }}
      />
    );

    return (
      <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
        {single ? singleLogo : fullLogo}
      </Link>
    );
  }
);

export default Logo;
