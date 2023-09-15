// react
import { useState } from 'react';
// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// types
//import { IProductReview } from 'src/types/product';
//
import ReviewItem from './ReviewItem';

// ----------------------------------------------------------------------

type Props = {
  reviews: {
    data: any[];
    page: number;
    documentsPerPage: number;
    totalDocuments: number;
  };
};

export default function HealthUnitReviewList({ reviews }: Props) {
  console.log('Reviews: ', reviews);
  const [page, setPage] = useState(1);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
<<<<<<< Updated upstream
      {reviews.map((review) => (
        <ProductReviewItem key={review.id} review={review} />
=======
      {reviews.data.map(review => (
        <ReviewItem key={review._id} review={review} />
>>>>>>> Stashed changes
      ))}

      <Pagination
        count={reviews.totalDocuments}
        color="primary"
        onChange={handleChangePage}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}
