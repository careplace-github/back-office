import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import CompanyProfileAbout from './CompanyProfileAbout';
import CompanyProfileSocialInfo from './CompanyProfileSocialInfo';

// ----------------------------------------------------------------------

Profile.propTypes = {
  info: PropTypes.object,
  posts: PropTypes.array,
};

export default function Profile({ company }) {
  // Get the normal services
  const services = company.services.filter(service => service.type === 'normal');

  // Get the special services
  const extraServices = company?.services.filter(service => service.type === 'special');

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          <CompanyProfileSocialInfo
            socialLinks={company?.business_profile?.social_links}
            services={services}
            extraServices={extraServices}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
