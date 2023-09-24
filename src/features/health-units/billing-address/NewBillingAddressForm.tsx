import { useEffect } from 'react';
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
// types

// assets
import { countries } from 'src/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { formatTaxNumber } from 'src/utils/functions';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (address: any) => void;
  onUpdate: (address: any) => void;
  legalInformation: any;
  addressToEdit: any;
};

export default function NewBillingAddressForm({
  open,
  legalInformation,
  addressToEdit,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const { legalName, taxNumber } = legalInformation;
  const isUpdate = !!addressToEdit;

  const NewAddressSchema = Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.object().shape({
      value: Yup.string().required(''),
      text: Yup.string().required(''),
    }),
    zipCode: Yup.string()
      .required('Zip code is required')
      .test('zipCode', 'Insert a valid Zip Code', value => {
        if (value?.length) return value?.length >= 8;
        return false;
      }),
    primary: Yup.boolean(),
  });

  const defaultValues = {
    city: addressToEdit?.city || '',
    address: addressToEdit?.street || '',
    zipCode: addressToEdit?.postal_code || '',
    country: { value: 'PT', text: 'Portugal' },
    primary: addressToEdit?.primary || true,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, isValid, isDirty },
  } = methods;

  useEffect(() => {
    console.log(addressToEdit);
    if (addressToEdit) {
      setValue('address', addressToEdit?.street);
      setValue('city', addressToEdit?.city);
      setValue('zipCode', addressToEdit?.postal_code);
      setValue('primary', addressToEdit?.primary);
      const findCountry = countries.find(c => {
        // console.log('code', c.code);
        // console.log('address country', addressToEdit?.country);
        return c.code === addressToEdit?.country;
      });
      setValue('country', {
        text: findCountry?.label as string,
        value: findCountry?.code as string,
      });
    }
  }, [addressToEdit]);

  const city = watch('city');
  const address = watch('address');
  const zipCode = watch('zipCode');
  const country = watch('country');
  const primary = watch('primary');

  useEffect(() => {
    console.log('city', city);
  }, [city]);

  const onSubmit = async data => {
    try {
      if (isUpdate) {
        onUpdate({
          street: data.address,
          postal_code: data.zipCode,
          city: data.city,
          country: data.country.value,
          primary: data.primary,
          _id: addressToEdit?._id,
        });
      } else {
        onCreate({
          street: data.address,
          postal_code: data.zipCode,
          city: data.city,
          country: data.country.value,
          primary: data.primary,
        });
      }

      onClose();
      reset();
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
        <DialogTitle>{!isUpdate ? 'New address' : 'Update Address'}</DialogTitle>

        <DialogContent sx={{ pt: '24px' }} dividers>
          <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}>
              <TextField label="Legal Name" value={legalName} disabled />

              <TextField label="Tax Number" value={formatTaxNumber(taxNumber)} disabled />
            </Box>

            <RHFTextField name="address" label="Address" />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}>
              <RHFTextField name="city" label="City" value={city} />

              <RHFTextField
                name="zipCode"
                label="Postal Code"
                value={getValues('zipCode')}
                onChange={e => {
                  const { value } = e.target;

                  /**
                   * Only allow numbers and dashes
                   */
                  if (!/^[0-9-]*$/.test(value)) {
                    return;
                  }

                  /**
                   * Portugal Zip Code Validation
                   */
                  if (country?.value === 'PT' || country?.value === '' || !country) {
                    // Add a dash to the zip code if it doesn't have one. Format example: XXXX-XXX
                    if (value.length === 5 && value[4] !== '-') {
                      setValue(
                        'zipCode',
                        `${value[0]}${value[1]}${value[2]}${value[3]}-${value[4]}`
                      );
                      return;
                    }

                    // Do not allow the zip code to have more than 8 digits (XXXX-XXX -> 8 digits)
                    if (value.length > 8) {
                      return;
                    }
                  }

                  setValue('zipCode', value);
                }}
              />
            </Box>

            <RHFAutocomplete
              name="country"
              label="Country"
              options={countries.map(c => {
                return { text: c.label, value: c.code };
              })}
              getOptionLabel={(option: string | { text: string; value: string }) => {
                const o = option as { text: string; value: string };
                return o.text as string;
              }}
              renderOption={(props, option) => {
                const { code, label } = countries.filter(c => c.label === option.text)[0];

                if (!label) {
                  return null;
                }

                return (
                  <li {...props} key={label}>
                    <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    />
                    {label}
                  </li>
                );
              }}
            />

            <RHFCheckbox disabled={isUpdate} name="primary" label="Use this address as primary." />
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
            onClick={() => onSubmit(getValues())}
            disabled={!isValid}>
            {!isUpdate ? 'Add' : 'update'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
