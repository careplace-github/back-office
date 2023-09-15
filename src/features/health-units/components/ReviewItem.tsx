// react
import { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
// types
// import { IProductReview } from 'src/types/product';
// components
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  review: any;
};

export default function HealthUnitReviewItem({ review }: Props) {
  const renderInfo = review && (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'row',
        md: 'column',
      }}
      sx={{
        width: { md: 240 },
        textAlign: { md: 'center' },
      }}>
      <Avatar
        src={review?.customer?.profile_picture}
        sx={{
          width: { xs: 48, md: 64 },
          height: { xs: 48, md: 64 },
        }}
      />

      <ListItemText
        primary={review?.name}
        secondary={fDate(review?.createdAt)}
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle2', mb: 0.5 }}
        secondaryTypographyProps={{ noWrap: true, typography: 'caption', component: 'span' }}
      />
    </Stack>
  );

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = event => {
    setOpenPopover(event.currentTarget);
  };

  const renderContent = review && (
    <Stack spacing={1} flexGrow={1}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Rating size="small" value={review?.rating} precision={0.1} readOnly />

        <Stack direction="row" alignItems="center">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
          <MenuPopover
            open={openPopover}
            onClose={() => setOpenPopover(null)}
            arrow="right-top"
            sx={{ width: 140 }}>
            <>
              <MenuItem
                onClick={() => {
                  onEditReview();
                  setOpenPopover(null);
                }}>
                <Iconify icon="eva:edit-fill" />
                Editar
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onDeleteReview();

                  setOpenPopover(null);
                }}
                sx={{ color: 'error.main' }}>
                <Iconify icon="eva:trash-2-outline" />
                Eliminar
              </MenuItem>
            </>
          </MenuPopover>
        </Stack>
      </Stack>
      <Typography variant="body2">{review?.comment}</Typography>
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ mt: 5, px: { xs: 3.5, md: 5 } }}>
      {renderInfo}

      {renderContent}
    </Stack>
  );
}
function onEditReview() {}

function onDeleteReview() {}
