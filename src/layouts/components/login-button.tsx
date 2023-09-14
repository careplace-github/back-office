// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
import { RouterLink } from 'src/components/router-link';
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  return (
    <Button component={RouterLink} href={PATHS.auth.login} variant="outlined" sx={{ mr: 1, ...sx }}>
      Entrar
    </Button>
  );
}
