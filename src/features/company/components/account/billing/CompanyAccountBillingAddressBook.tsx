import PropTypes from 'prop-types';
// @mui
import { Box, Card, Button, Typography, Stack, Divider } from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

AccountBillingAddressBook.propTypes = {
  addressBook: PropTypes.array,
};

export default function AccountBillingAddressBook({ addressBook, company }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Informação de Faturação
        </Typography>
      </Stack>

      <Stack spacing={3} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
        <Stack spacing={1}>
          <Typography variant="subtitle1">{addressBook.bank_name}</Typography>

          <Typography variant="body2">
            <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
              IBAN:
            </Box>
            **** **** **** **** **** {addressBook?.last4}
          </Typography>

          <Typography variant="body2">
            <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
              NIPC:
            </Box>
            {company?.legal_information?.tax_number}
          </Typography>

          <Typography variant="body2">
            <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
              Nome:
            </Box>
            {company?.legal_information?.name}
          </Typography>

          <Typography variant="body2">
            <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
              Morada:
            </Box>
            {`${company?.legal_information?.address?.street}, ${company?.legal_information?.address?.postal_code} ${company?.legal_information?.address?.city}`}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
