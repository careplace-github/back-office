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
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          <CompanyProfileAbout company={company} />
        </Stack>
      </Grid>
    </Grid>
  );
}
