import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack, { StackProps } from '@mui/material/Stack';
// utils
import { formatTaxNumber } from 'src/utils/functions';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = PaperProps &
  StackProps & {
    action?: React.ReactNode;
    account: any;
  };

export default function HealthUnitBankAccountItem({ account, action, sx, ...other }: Props) {
  const { account_holder_name, bank_name, default_for_currency, last4 } = account;

  const formatIBAN = number => {
    return `PT** **** **** *********${last4.charAt(0)}${last4.charAt(1)} ${last4.charAt(
      2
    )}${last4.charAt(3)}`;
  };

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
          <Typography variant="subtitle2">{bank_name}</Typography>

          {default_for_currency && (
            <Label color="info" sx={{ ml: 1 }}>
              Primary
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Holder Name: {account_holder_name}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Account Number: {formatIBAN(last4)}
        </Typography>
      </Stack>

      {action && action}
    </Stack>
  );
}
