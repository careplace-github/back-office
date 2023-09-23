import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import fetch from 'src/lib/fetch';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// utils
import { fData } from 'src/utils/formatNumber';
// types
// components
import { CustomUploadAvatar } from 'src/components/upload-avatar/UploadAvatar';
import { TextField, Grid } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  onClose: VoidFunction;
  review?: any;
  healthUnitId?: string;
  fetchReviews?: () => void;
}

export default function HealthUnitReviewNewForm({
  healthUnitId,
  onClose,
  review,
  fetchReviews,
  ...other
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(review ? (review?.customer?.name as string) : '');
  const [email, setEmail] = useState<string>(review ? (review?.customer?.email as string) : '');
  const [rating, setRating] = useState<number>(review ? (review?.rating as number) : 0);
  const [comment, setComment] = useState<string>(review ? (review?.comment as string) : '');
  const [logo, setLogo] = useState<any>(
    review ? (review?.customer?.profile_picture as string) : undefined
  );
  const blockSubmit = !name || !email || !rating || !comment;
  const blockCustomerUpdate = review?.type !== 'mock' && review;
  const isUpdate = !!review;

  const reset = () => {
    setIsLoading(false);
    setName('');
    setEmail('');
    setRating(0);
    setComment('');
    setLogo(undefined);
  };

  const [fileData, setFileData] = useState<FormData | null>(null);

  const handleDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]; // eslint-disable-line

    const formData = new FormData();
    formData.append('file', file);

    setFileData(formData);

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      setLogo(newFile.preview);
    }
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);

    let uploadedFileURL = null;
    try {
      if (fileData) {
        const response = await fetch('/api/files', {
          method: 'POST',
          body: fileData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedFileURL = response.fileURL;
      } else {
        uploadedFileURL = review?.customer?.profile_picture;
      }
      let customer;
      if (!isUpdate) {
        customer = await fetch('/api/customers', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            profile_picture: uploadedFileURL,
          }),
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        customer = await fetch(`/api/customers/${review?.customer?._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name,
            email,
            profile_picture: uploadedFileURL || null,
          }),
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (!isUpdate) {
        await fetch(`/api/reviews/health-units/${healthUnitId}`, {
          method: 'POST',
          body: JSON.stringify({
            comment,
            rating,
            customer: customer._id,
          }),
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await fetch(`/api/reviews/health-units/${healthUnitId}/${review._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            comment,
            rating,
            customer: customer._id,
          }),
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      reset();
      if (fetchReviews) fetchReviews();
      onClose();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  const handleRatingChange = (event: any) => {
    setRating(Number(event.target.value));
  };

  return (
    <Dialog onClose={onClose} {...other} maxWidth="md" fullWidth>
      <form>
        <DialogTitle> {isUpdate ? 'Add Review' : 'Update Review'} </DialogTitle>

        <DialogContent>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}></Stack>
          <CustomUploadAvatar
            disabled={blockCustomerUpdate}
            name="logo"
            value={logo}
            maxSize={3145728}
            onDrop={handleDrop}
            helperText={
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  mb: 5,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.secondary',
                }}>
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br /> Max size {fData(5045728)}
              </Typography>
            }
          />
          <Grid container xs={12} sx={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)' }}>
            <TextField
              disabled={blockCustomerUpdate}
              name="name"
              label="Name *"
              value={name}
              onChange={e => setName(e.target.value)}
              sx={{ mt: 3 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              disabled={blockCustomerUpdate}
              name="email"
              value={email}
              label="Email *"
              onChange={e => setEmail(e.target.value)}
              sx={{ mt: 3 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Rating
              sx={{ mt: 3 }}
              size="small"
              value={Number(rating)}
              onChange={handleRatingChange}
            />
            <TextField
              name="comment"
              label="Comment *"
              value={comment}
              onChange={e => setComment(e.target.value)}
              multiline
              minRows={5}
              sx={{ mt: 3 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton
            disabled={blockSubmit}
            onClick={() => onSubmit()}
            variant="contained"
            loading={isLoading}>
            {isUpdate ? 'Update' : 'Add'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
