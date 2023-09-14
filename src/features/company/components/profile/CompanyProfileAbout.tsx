import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import Tooltip from 'src/components/tooltip';

// utis
import { fCountry } from 'src/utils/formatCountry';

// ----------------------------------------------------------------------

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  company: PropTypes.object,
  country: PropTypes.string,
  email: PropTypes.string,
  quote: PropTypes.string,
  role: PropTypes.string,
  school: PropTypes.string,
};

export default function ProfileAbout({ company, quote, country, email, role, school }) {
  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={0} sx={{ mb: -2 }}>
          <Typography variant="h6" paragraph>
            Sobre
          </Typography>
          <Tooltip
            placement="right"
            text="Para alterar as informações da sua empresa por favor contacte-nos através do email: suporte@careplace.pt"
            sx={{ position: 'relative', left: '10px', top: '-10px' }}
          />
        </Stack>

        <Typography variant="body2">{company?.business_profile?.description}</Typography>

        <Stack direction="row">
          <StyledIcon icon="mdi:web" />

          <Typography variant="body2">
            <Link component="span" variant="subtitle2" color="text.primary">
              {company?.business_profile?.website ?? ''}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="eva:pin-fill" />

          <Typography variant="body2">
            {company?.addresses[0]?.street &&
            company?.addresses[0]?.postal_code &&
            company?.addresses[0]?.city &&
            company?.addresses[0]?.country
              ? `${company?.addresses[0]?.street}, ${company?.addresses[0]?.postal_code}, ${
                  company?.addresses[0]?.city
                }, ${fCountry(company?.addresses[0]?.country)}`
              : ''}
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="eva:email-fill" />
          <Typography variant="body2">{company?.business_profile?.email ?? ''}</Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="ic:phone" />

          <Typography variant="body2">{company?.business_profile?.phone ?? ''}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
