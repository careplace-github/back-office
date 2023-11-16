import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { TextField } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { formatTaxNumber } from 'src/utils/functions';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (address: any) => void;
  forcePrimary: boolean;
};

export default function NewBankAccountForm({ open, onClose, onCreate, forcePrimary }: Props) {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const NewAccountSchema = Yup.object().shape({
    accountNumber: Yup.string().required(),
    holderName: Yup.string().required(),
    primary: Yup.boolean(),
  });

  const defaultValues = {
    accountNumber: '',
    holderName: '',
    primary: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewAccountSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    getValues,
    formState: { isValid },
  } = methods;

  const holderName = watch('holderName');
  const accountNumber = watch('accountNumber');

  useEffect(() => {
    if (!holderName || !accountNumber) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [holderName, accountNumber]);

  const onSubmit = async data => {
    try {
      onCreate({
        accountNumber: data.accountNumber,
        holderName: data.holderName,
        primary: data.primary,
      });
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}>
      <FormProvider methods={methods}>
        <DialogTitle>New Bank Account</DialogTitle>

        <DialogContent sx={{ pt: '24px' }} dividers>
          <Stack spacing={3}>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns="repeat(1, 1fr)">
              <RHFTextField name="holderName" label="Holder Name" />

              <RHFTextField name="accountNumber" label="Account Number" />
            </Box>

            <RHFCheckbox
              disabled={forcePrimary}
              name="primary"
              label="Use this bank account as primary."
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => {
              onClose();
              reset();
            }}>
            Cancel
          </Button>

          <LoadingButton
            variant="contained"
            loading={isSubmitting}
            // onClick={() => onSubmit(getValues())}
            onClick={() => onSubmit(getValues())}
            disabled={!isFormValid}>
            Add
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
