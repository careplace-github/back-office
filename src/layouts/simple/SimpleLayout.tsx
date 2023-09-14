// next
import dynamic from 'next/dynamic';
// @mui
import Box from '@mui/material/Box';
// config
import { HEADER } from 'src/layouts/config';
// routes
import { usePathname } from 'src/hooks';
// hooks
import useOffSetTop from 'src/hooks/useOffSetTop';
import Footer from '../main/footer';

//
const Header = dynamic(() => import('./Header'), { ssr: false });

// ----------------------------------------------------------------------

type Props = {
  children?: React.ReactNode;
};

export default function SimpleLayout({ children }: Props) {
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <>
      <Header isOffset={isOffset} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 10 },
          }),
        }}>
        {children}
      </Box>

      <Footer />
    </>
  );
}
