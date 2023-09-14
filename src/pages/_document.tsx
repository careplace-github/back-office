import * as React from 'react';
// next
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from 'next/document';
import { AppType } from 'next/app';
// emotion
import createEmotionServer from '@emotion/server/create-instance';
// utils
import createEmotionCache from 'src/utils/createEmotionCache';
// components
import Analytics from 'src/components/analytics';
// theme
import palette from 'src/theme/palette';
import { primaryFont } from 'src/theme/typography';
//
import { MyAppProps } from './_app';

// ----------------------------------------------------------------------

const Favicon = () => (
  <>
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon-180x180.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
  </>
);

const Meta = () => (
  <>
    {/* PWA primary color */}

    {/* Chrome, Firefox OS and Opera */}
    <meta name="theme-color" content="#ffffff" />
    {/* Windows Phone */}
    <meta name="msapplication-navbutton-color" content="#ffffff" />
    {/* iOS Safari */}
    <meta name="apple-mobile-web-app-status-bar-style" content="#ffffff" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="Careplace" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="Careplace" />
    <meta name="msapplication-TileColor" content="#ffffff" />

    {/* SEO */}
    <meta name="title" content="Careplace Admin" />
    <meta
      name="description"
      content="Careplace Admin é um software de gestão de operações para empresas de apoio domiciliário, lares de idosos e residências sénior. Através da Careplace Admin, as empresas de apoio domiciliário podem gerir os seus clientes, colaboradores, faturação, recrutamento, serviços e muito mais. A Careplace Admin é a solução ideal para empresas de apoio domiciliário que pretendem aumentar a sua eficiência e produtividade. Registe-se gratuitamente em www.business.careplace.pt e transforme a maneira como gere a sua empresa de apoio domiciliário."
    />
    <meta
      name="keywords"
      content="careplace business,careplace,software apoio domiciliário,software apoio ao domicílio,software cuidados domiciliários,software cuidados ao domicílio,software apoio domiciliário lisboa,software apoio domiciliário porto,software apoio domiciliário coimbra,software apoio domiciliário braga,software apoio domiciliário aveiro,software apoio domiciliário faro,software apoio domiciliário algarve,software apoio domiciliário madeira,software apoio domiciliário açores,software apoio domiciliário viseu,software apoio domiciliário leiria,software apoio domiciliário santarém,software apoio domiciliário évora,software apoio domiciliário setúbal,software apoio domiciliário beja,software apoio domiciliário castelo branco,software apoio domiciliário guarda,software apoio domiciliário vila real,software apoio domiciliário bragança,software apoio domiciliário portalegre"
    />
    <meta name="author" content="Careplace" />
  </>
);

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

export default function MyDocument({ emotionStyleTags }: MyDocumentProps) {
  return (
    <Html lang="pt" className={primaryFont.className}>
      <Head>
        <Favicon />
        <Meta />
        {/* Emotion */}
        <meta name="emotion-insertion-point" content="" />
        {emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* 
          We are using the analytics component on the _document.tsx file to reduce potential redundancy and improving page load times.
          By including the analytics component on the _document.tsx file, we are ensuring that the analytics component is only loaded once for the entire application as it will be included on every page on the HTML document.
        */}
        <Analytics />
      </body>
    </Html>
  );
}

// ----------------------------------------------------------------------

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();

  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & MyAppProps>) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);

  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
