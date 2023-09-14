// @mui
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export default function HeaderShadow({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: '0px 1px 20px rgba(0,0,0,0.07)',
        ...sx,
      }}
      {...other}
    />
  );
}
