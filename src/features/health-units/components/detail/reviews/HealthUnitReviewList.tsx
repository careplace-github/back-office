// react
import { useEffect, useState } from 'react';
// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// components
import EmptyState from 'src/components/empty-state/EmptyState';
import { CircularProgress, Box } from '@mui/material';
import ReviewItem from './HealthUnitDetailReviewItem';

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
  onReviewModalClose: Function;
};

export default function HealthUnitReviewList({
  healthUnitId,
  onReviewModalClose,
}: HealthUnitReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [documentsPerPage, setDocumentsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/reviews/health-units/${healthUnitId}?page=${page}&documentsPerPage=${documentsPerPage}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        setIsLoading(false);
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
  }, [onReviewModalClose]);

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
          }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : reviews?.length > 0 ? (
        reviews?.map(review => (
          <ReviewItem key={review._id} review={review} fetchReviews={fetchData} />
        ))
      ) : (
        <EmptyState
          title="This Health Unit has no reviews"
          description="All reviews will be displayed here"
          icon="material-symbols:comments-disabled"
        />
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
