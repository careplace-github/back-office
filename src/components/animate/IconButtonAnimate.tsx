import { m } from 'framer-motion';
import { forwardRef } from 'react';
// @mui
import { Box, IconButton, IconButtonProps } from '@mui/material';

// ----------------------------------------------------------------------

type AnimateWrapProp = {
  children: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  disableAnimation: boolean;
};

const IconButtonAnimate = forwardRef<
  HTMLButtonElement,
  IconButtonProps & { disableAnimation: boolean }
>(({ disableAnimation = false, children, size = 'medium', ...other }, ref) => (
  <AnimateWrap disableAnimation={disableAnimation} size={size}>
    <IconButton size={size} ref={ref} {...other}>
      {children}
    </IconButton>
  </AnimateWrap>
));

export default IconButtonAnimate;

// ----------------------------------------------------------------------

const varSmall = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

const varMedium = {
  hover: { scale: 1.09 },
  tap: { scale: 0.97 },
};

const varLarge = {
  hover: { scale: 1.08 },
  tap: { scale: 0.99 },
};

function AnimateWrap({ size, children, disableAnimation }: AnimateWrapProp) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={
        disableAnimation ? undefined : (isSmall && varSmall) || (isLarge && varLarge) || varMedium
      }
      sx={{
        display: 'inline-flex',
      }}>
      {children}
    </Box>
  );
}
