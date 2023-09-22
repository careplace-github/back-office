// react
import { useState, useEffect } from 'react';
// @mui
import { Modal, Box, Typography, useTheme, Button, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import Label from 'src/components/label';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
import { useResponsive } from 'src/hooks';

// types
// import { IProductReview } from 'src/types/product';
// components
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import MenuItem from '@mui/material/MenuItem';

import ReviewForm from './HealthUnitDetailReviewForm';

// ----------------------------------------------------------------------

type Props = {
  review: any;
};

export default function HealthUnitReviewItem({ review }: Props) {
  const [editReview, setEditReview] = useState(false);

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
        primary={review?.customer?.name}
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
          {review?.type === 'mock' && <Label color="info">Mock Review</Label>}
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
                  setEditReview(true);
                  setOpenPopover(null);
                }}>
                <Iconify icon="eva:edit-fill" />
                Edit
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setOpenPopover(null);
                  setOpen(true);
                }}
                sx={{ color: 'error.main' }}>
                <Iconify icon="eva:trash-2-outline" />
                Delete
              </MenuItem>
            </>
          </MenuPopover>
        </Stack>
      </Stack>
      <Typography variant="body2">{review?.comment}</Typography>
    </Stack>
  );

  const isMdUp = useResponsive('up', 'md');
  const theme = useTheme();

  const [open, setOpen] = useState(false);

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
      {editReview && (
        <ReviewForm
          review={review}
          onClose={() => setEditReview(false)}
          open={editReview}
          sx={{}}
        />
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}>
        <Box
          sx={{
            width: isMdUp ? 'auto' : '100vw',
            height: isMdUp ? 'auto' : '100vh',
            minWidth: isMdUp ? '500px' : undefined,
            maxHeight: isMdUp ? '90vh' : '100vh',
            p: isMdUp ? '50px' : '20px',
            pt: isMdUp ? '50px' : '75px',
            pb: isMdUp ? '50px' : '75px',
            backgroundColor: 'white',
            borderRadius: isMdUp ? '16px' : '0',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateY(-50%) translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflowY: 'auto',
          }}>
          <Iconify
            width={30}
            height={30}
            icon="material-symbols:close-rounded"
            sx={{
              position: 'absolute',
              right: isMdUp ? '50px' : '20px',
              cursor: 'pointer',
              '&:hover': {
                cursor: 'pointer',
                color: theme.palette.mode === 'light' ? 'grey.400' : 'white',
              },
            }}
            onClick={() => {
              setOpen(false);
            }}
          />

          <Typography
            variant="body2"
            sx={{ mt: 5, mb: 2, color: 'text.secondary', textAlign: 'center' }}>
            Are you sure you want to delete this review? <br />
            This action cannot be undone.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
              width: '100%',
            }}>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => {
                setOpen(false);
              }}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setOpen(false);
              }}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Stack>
  );
}
