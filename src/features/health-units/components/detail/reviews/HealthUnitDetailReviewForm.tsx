import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  onClose: VoidFunction;
  review?: any;
}

export default function HealthUnitReviewNewForm({ onClose, review, ...other }: Props) {
  const ReviewSchema = Yup.object().shape({
    rating: Yup.number().min(1, 'Rating must be greater than or equal to 1'),
    review: Yup.string().required('Review is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  console.log('Review: ', review);

  const defaultValues = {
    rating: review?.rating || 0,
    comment: review?.comment || '',
    name: review?.customer?.name || '',
    email: review?.customer?.email || '',
    fileChanged: '',
    logo: review?.customer?.profile_picture || '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  const [fileData, setFileData] = useState<FormData | null>(null);

  const handleDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0]; // eslint-disable-line

      const formData = new FormData();
      formData.append('file', file);

      setFileData(formData);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('fileChanged', Date.now().toString()); // update the hidden field

        setValue('logo', newFile.preview, { shouldDirty: true });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async data => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      reset();
      onClose();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog onClose={onClose} {...other} maxWidth="md" fullWidth>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle> Add Review </DialogTitle>

        <DialogContent>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}></Stack>
          {!!errors.rating && <FormHelperText error> ERROR </FormHelperText>}
          <RHFUploadAvatar
            name="logo"
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
          <input type="hidden" {...register('fileChanged')} /> {/* Add this line */}
          <RHFTextField
            name="name"
            label="Name *"
            sx={{ mt: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <RHFTextField
            name="email"
            label="Email *"
            sx={{ mt: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Rating sx={{ mt: 3 }} {...field} size="small" value={Number(field.value)} />
            )}
          />
          <RHFTextField
            name="comment"
            label="Comment *"
            multiline
            minRows={5}
            sx={{ mt: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
