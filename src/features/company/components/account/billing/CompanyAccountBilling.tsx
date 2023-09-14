import PropTypes from 'prop-types';
// @mui
import { Box, Grid, Card, Button, Typography, Stack } from '@mui/material';

//
import AccountBillingAddressBook from './CompanyAccountBillingAddressBook';
import AccountBillingPaymentMethod from './CompanyAccountBillingPaymentMethod';
import AccountBillingInvoiceHistory from './CompanyAccountBillingInvoiceHistory';

// ----------------------------------------------------------------------

AccountBilling.propTypes = {
  invoices: PropTypes.array,
  addressBook: PropTypes.array,
  company: PropTypes.object,
};

export default function AccountBilling({ company }) {
  return (
    <Grid container spacing={7}>
      <Grid item xs={12} md={6.5}>
        <AccountBillingAddressBook
          addressBook={company?.stripe_information?.external_accounts[0]}
          company={company}
        />
      </Grid>

      <Grid item xs={12} md={5.5}>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography
              variant="overline"
              sx={{ mb: 3, display: 'block', color: 'text.secondary' }}>
              Plano
            </Typography>
            <Typography variant="h4"> Premium </Typography>
            <Box
              sx={{
                mt: { xs: 2, sm: 0 },
                position: { sm: 'absolute' },
                top: { sm: 24 },
                right: { sm: 24 },
                bottom: { sm: 24 },
              }}>
              <Button size="small" variant="outlined" disabled>
                Alterar Plano
              </Button>
            </Box>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
}
