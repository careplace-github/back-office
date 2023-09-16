// react
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// utils
// import { fShortenNumber } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
// types
// import { IProductReview } from 'src/types/product';
//
import HealthUnitReviewList from './HealthUnitReviewList';
import HealthUniReviewNewForm from './ReviewItem';
import NewReviewForm from './ReviewForm';

// ----------------------------------------------------------------------

type Props = {
  totalReviews: number;
  averageRating: number;
  ratings: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  healthUnitId: string;
  reviews: {
    data: any[];
    page: number;
    documentsPerPage: number;
    totalDocuments: number;
  };
};

export default function HealthUnitDetailsReview({
  totalReviews,
  averageRating,
  healthUnitId,
  ratings,
  reviews,
}: Props) {
  const [newReview, setNewReview] = useState(false);
  const total = totalReviews;

  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="subtitle2">Average Rating</Typography>

      <Typography variant="h2">{averageRating}/5</Typography>

      <Rating readOnly value={averageRating} precision={0.1} />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {totalReviews > 1 && ` ${totalReviews} reviews`}
        {totalReviews === 1 && ` ${totalReviews} review`}
      </Typography>
    </Stack>
  );

  const renderProgress = (
    <Stack
      spacing={1.5}
      sx={{
        py: 5,
        px: { xs: 3, md: 5 },
        borderLeft: theme => ({
          md: `dashed 1px ${theme.palette.divider}`,
        }),
        borderRight: theme => ({
          md: `dashed 1px ${theme.palette.divider}`,
        }),
      }}>
      {Object.entries(ratings)
        .slice(0)
        .reverse()
        .map(([star, reviewCount]) => (
          <Stack key={star} direction="row" alignItems="center">
            <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
              {star}
            </Typography>

            <LinearProgress
              color="inherit"
              variant="determinate"
              value={(reviewCount / total) * 100}
              sx={{
                mx: 2,
                flexGrow: 1,
              }}
            />

            <Typography
              variant="body2"
              component="span"
              sx={{
                minWidth: 48,
                color: 'text.secondary',
              }}>
              {reviewCount}
            </Typography>
          </Stack>
        ))}
    </Stack>
  );

  const renderReviewButton = (
    <Stack alignItems="center" justifyContent="center">
      <Button
        size="large"
        variant="soft"
        color="inherit"
        onClick={() => setNewReview(true)}
        startIcon={<Iconify icon="mdi:plus-circle-outline" />}>
        Add Review
      </Button>
    </Stack>
  );

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{
          py: { xs: 5, md: 0 },
        }}>
        {renderSummary}

        {renderProgress}

        {renderReviewButton}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <HealthUnitReviewList healthUnitId={healthUnitId} />

      {newReview && <NewReviewForm onClose={() => setNewReview(false)} open={newReview} sx={{}} />}
    </>
  );
}
