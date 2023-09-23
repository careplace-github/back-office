import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack, { StackProps } from '@mui/material/Stack';
// utils
import { formatTaxNumber } from 'src/utils/functions';
import { countries } from 'src/data';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = PaperProps &
  StackProps & {
    action?: React.ReactNode;
    address: any;
    legalInformation: any;
  };

export default function AddressItem({ address, legalInformation, action, sx, ...other }: Props) {
  const { street, city, country, postal_code, primary } = address;
  const { legalName, taxNumber } = legalInformation;
  const countryLabel = countries.find(c => c.code === country);

  useEffect(() => {
    console.log('Address', address);
  }, [address]);

  return (
    <Stack
      component={Paper}
      spacing={2}
      alignItems={{ md: 'flex-end' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...other}>
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">{legalName}</Typography>

          {primary && (
            <Label color="info" sx={{ ml: 1 }}>
              Primary
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Tax Number: {formatTaxNumber(taxNumber)}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Address: {street}, {postal_code}, {city}, {countryLabel?.label}
        </Typography>
      </Stack>

      {action && action}
    </Stack>
  );
}
