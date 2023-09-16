// react
import { useEffect, useState } from 'react';
// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { Box, CircularProgress } from '@mui/material';
// types
// import { IProductReview } from 'src/types/product';
//
import ReviewItem from './ReviewItem';
// ----------------------------------------------------------------------

type Review = {
  _id: string;
  rating: number;
  comment: string;
  customer: {
    name: string;
    email: string;
    profile_picture: string;
  };
};

type HealthUnitReviewListProps = {
  healthUnitId: string;
};

export default function HealthUnitReviewList(healthUnitId: HealthUnitReviewListProps) {
  // eslint-disable-next-line react/destructuring-assignment
  const _healthUnitId = healthUnitId.healthUnitId;

  const [reviews, setReviews] = useState<Review[]>([]);

  const [page, setPage] = useState(0);
  const [documentsPerPage, setDocumentsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/reviews/health-units/${_healthUnitId}?page=${page}&documentsPerPage=${documentsPerPage}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      setReviews(responseData.data);
      setDocumentsPerPage(responseData.documentsPerPage);
      setTotalPages(responseData.totalPages);
      setTotalDocuments(responseData.totalDocuments);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, documentsPerPage]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : (
        reviews.map(review => <ReviewItem key={review._id} review={review} />)
      )}

      <Pagination
        count={totalPages}
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
