// next
import Head from 'next/head';
// layouts
import CompactLayout from 'src/layouts/compact';
// features
import { Error500View } from 'src/features/common';

// ----------------------------------------------------------------------

Page500.getLayout = page => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <>
      <Head>
        <title> 500 Erro de Servidor | Careplace Admin </title>
      </Head>

      <Error500View />
    </>
  );
}
