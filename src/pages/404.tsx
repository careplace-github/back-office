// next
import Head from 'next/head';
// layouts
import CompactLayout from 'src/layouts/compact';
// features
import { Error404View } from 'src/features/common';

// ----------------------------------------------------------------------

Page404.getLayout = page => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Head>
        <title> 404 Página Não Encontrada | Careplace Admin </title>
      </Head>

      <Error404View />
    </>
  );
}
