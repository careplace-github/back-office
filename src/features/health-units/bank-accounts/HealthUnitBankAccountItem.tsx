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
  const { number, holderName, bankName, primary } = account;

  useEffect(() => {
    console.log('Account', account);
  }, [account]);

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
          <Typography variant="subtitle2">{bankName}</Typography>

          {primary && (
            <Label color="info" sx={{ ml: 1 }}>
              Primary
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Holder Name: {holderName}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Account Number: {number}
        </Typography>
      </Stack>

      {action && action}
    </Stack>
  );
}
