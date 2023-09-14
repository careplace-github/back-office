// @mui
import { Typography, Stack, Link } from '@mui/material';
import Badge, { badgeClasses } from '@mui/material/Badge';
// components
import Logo from 'src/components/logo';
import { useResponsive } from 'src/hooks';
import Label from 'src/components/label';

//
import AuthLoginIllustration from 'src/features/auth/components/AuthLoginIllustration';
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  illustration?: string;
  children: React.ReactNode;
};

export default function LoginLayout({ children, illustration, title }: Props) {
  const isMdUp = useResponsive('up', 'md');
  return (
    <StyledRoot>
      <StyledSection>
        <Badge
          sx={{
            [`& .${badgeClasses.badge}`]: {
              top: 8,
              right: -30,
            },
            zIndex: 90,
            position: 'absolute',
            top: '40px',
            left: '40px',
          }}
          badgeContent={
            <Link href="" target="_blank" rel="noopener" underline="none">
              <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
                ADMIN
              </Label>
            </Link>
          }>
          <Logo height={37} />
        </Badge>

        <Typography variant="h3" sx={{ mb: 10, mt: -5, maxWidth: 480, textAlign: 'center' }}>
          {title || ''}
        </Typography>

        <AuthLoginIllustration />

        <StyledSectionBg />
      </StyledSection>

      <StyledContent>
        <Stack sx={{ width: 1 }}>
          {!isMdUp && (
            <Logo
              height={{ xs: 60, sm: 85, md: 40 }}
              sx={{
                zIndex: 90,
                mb: '70px',
              }}
            />
          )}
          {children}
        </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
