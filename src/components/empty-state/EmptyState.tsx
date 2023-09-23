import React, { ReactNode } from 'react';
// hooks
import { useResponsive } from 'src/hooks';
// components
import { Typography, Stack } from '@mui/material';
import Iconify from '../iconify/Iconify';

type IEmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  containerWidth?: string;
  containerHeight?: string;
  actionComponent?: ReactNode;
};

function EmptyState({
  icon = 'ic:baseline-cloud-off',
  title,
  description,
  containerWidth = '100%',
  containerHeight = '100%',
  actionComponent,
}: IEmptyStateProps) {
  const isSmUp = useResponsive('up', 'sm');

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap="5px"
      sx={{
        width: containerWidth,
        height: containerHeight,
        minHeight: '300px',
        mt: '-20px',
        gridColumnStart: 1,
        gridColumnEnd: 3,
      }}>
      <Iconify icon={icon} width={60} height={60} />
      <Typography variant="h6" sx={{ mt: isSmUp ? '20px' : '0px' }}>
        {title}
      </Typography>
      <Typography sx={{ maxWidth: '90%', textAlign: 'center' }}>{description}</Typography>
      {actionComponent}
    </Stack>
  );
}

export default EmptyState;
