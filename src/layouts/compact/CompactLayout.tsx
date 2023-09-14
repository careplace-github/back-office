// next
import dynamic from 'next/dynamic';
// @mui
import { Stack, Container } from '@mui/material';
// config
import { HEADER } from 'src/layouts/config';
// hooks
import useOffSetTop from 'src/hooks/useOffSetTop';
//
const Header = dynamic(() => import('./Header'), { ssr: false });

// ----------------------------------------------------------------------

type Props = {
  children?: React.ReactNode;
};

export default function CompactLayout({ children }: Props) {
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <>
      <Header isOffset={isOffset} />

      <Container component="main">
        <Stack
          sx={{
            py: 12,
            m: 'auto',
            maxWidth: 600,
            minHeight: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
          }}>
          {children}
        </Stack>
      </Container>
    </>
  );
}
