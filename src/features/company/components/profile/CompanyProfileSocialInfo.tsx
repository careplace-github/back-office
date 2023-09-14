import PropTypes from 'prop-types';
// @mui
import { Link, Card, CardHeader, Stack, Typography, Box } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import Tooltip from 'src/components/tooltip';

// ----------------------------------------------------------------------

ProfileSocialInfo.propTypes = {
  socialLinks: PropTypes.shape({
    facebook: PropTypes.string,
    instagram: PropTypes.string,
    linkedin: PropTypes.string,
    twitter: PropTypes.string,
    youtube: PropTypes.string,
  }),
};
function OverviewItem({ icon, label }) {
  return (
    <Stack spacing={1.5} direction="row" alignItems="flex-start">
      <Iconify icon={icon} width={24} color="text.secondary" />
      <Stack spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Stack>
    </Stack>
  );
}
const _socials = [
  {
    name: 'Facebook',
    icon: 'bx:bxl-facebook',
    color: '#1877F2',
    value: 'facebook',
  },
  {
    name: 'Instagram',
    icon: 'bx:bxl-instagram',
    color: '#E1306C',
    value: 'instagram',
  },

  {
    name: 'LinkedIn',
    icon: 'bx:bxl-linkedin',
    color: '#2867B2',
    value: 'linkedin',
  },
  {
    name: 'Twitter',
    icon: 'bx:bxl-twitter',
    color: '#1DA1F2',
    value: 'twitter',
  },
  {
    name: 'YouTube',
    icon: 'bx:bxl-youtube',
    color: '#FF0000',
    value: 'youtube',
  },
];

export default function ProfileSocialInfo({ socialLinks, services, extraServices }) {
  const { facebook, instagram, linkedin, twitter, youtube } = socialLinks;

  // get only the ids of the services
  services = services.map(service => service.name);

  const _socialsAux = [facebook, instagram, linkedin, twitter, youtube];

  // Remove empty social links of _socialsAux from _socials
  _socialsAux.forEach(social => {
    if (social === '' || social === undefined || social === null) {
      _socials.splice(_socials.indexOf(social), 1);
    }
  });

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={0}>
          <Typography variant="h6" paragraph>
            Serviços de Apoio Domiciliário
          </Typography>
          <Tooltip
            placement="right"
            text="Para alterar as informações da sua empresa por favor contacte-nos através do email: suporte@careplace.pt"
            sx={{ position: 'relative', left: '10px', top: '-10px' }}
          />
        </Stack>
        <Box
          sx={{
            rowGap: 2,
            columnGap: 3,
            display: 'grid',
            pb: 5,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}>
          {services.map(serviceItem => (
            <Stack key={serviceItem} direction="row" alignItems="center">
              <Iconify
                icon="carbon:checkmark"
                sx={{
                  mr: 2,
                  color: 'primary.main',
                }}
              />
              {serviceItem}
            </Stack>
          ))}
        </Box>
        <Typography variant="h6" sx={{ pb: 3 }}>
          Serviços Adicionais
        </Typography>
        <Box
          sx={{
            rowGap: 2,
            columnGap: 3,
            display: 'grid',
            pb: 5,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}>
          {extraServices.map(service => {
            return <OverviewItem key={service._id} icon={service.icon} label={service.name} />;
          })}
        </Box>
      </Stack>
    </Card>
  );
}
