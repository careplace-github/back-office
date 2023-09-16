// i18n
import '../locales/i18n';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
// import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

import { CacheProvider, EmotionCache } from '@emotion/react';
// next
import { NextPage } from 'next';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
// redux
import { Provider as ReduxProvider } from 'react-redux';
// @mui
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// redux
import { store } from 'src/redux/store';
// utils
import createEmotionCache from 'src/utils/createEmotionCache';
// theme
import ThemeProvider from 'src/theme';
// locales
import ThemeLocalization from 'src/locales';
// components
import { StyledChart } from 'src/components/chart';
import ProgressBar from 'src/components/progress-bar';
import SnackbarProvider from 'src/components/snackbar';
import { MotionLazyContainer } from 'src/components/animate';
import { ThemeSettings, SettingsProvider } from 'src/features/settings';
//
import { SessionProvider } from 'next-auth/react';

// ----------------------------------------------------------------------

const clientSideEmotionCache = createEmotionCache();

const AuthSession = ({ children, pageProps }) => {
  const router = useRouter();

  /** 
   *  if (
    router.pathname.startsWith('/app/auth') ||
    router.pathname.startsWith('/demo') ||
    router.pathname.startsWith('/support') ||
    router.pathname.startsWith('/coming-soon')
  ) {
    return children;
  }

  */

  return (
    <SessionProvider
      session={
        // only include the user object in the client session
        pageProps.session?.user
      }>
      {children}
    </SessionProvider>
  );
};

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}
export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  const getLayout = Component.getLayout ?? (page => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <AuthSession pageProps={pageProps}>
        <ReduxProvider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SettingsProvider>
              <MotionLazyContainer>
                <ThemeProvider>
                  <ThemeSettings>
                    <ThemeLocalization>
                      <SnackbarProvider>
                        <StyledChart />
                        <ProgressBar />
                        {getLayout(<Component {...pageProps} />)}
                      </SnackbarProvider>
                    </ThemeLocalization>
                  </ThemeSettings>
                </ThemeProvider>
              </MotionLazyContainer>
            </SettingsProvider>
          </LocalizationProvider>
        </ReduxProvider>
      </AuthSession>
    </CacheProvider>
  );
}
