// next
import Head from 'next/head';
// layouts
import CompactLayout from 'src/layouts/compact';
// features
import { Error403View } from 'src/features/common';

// ----------------------------------------------------------------------

Page403.getLayout = page => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page403() {
  return (
    <>
      <Head>
        <title> 403 Sem Permissão | Careplace Business </title>
      </Head>

      <Error403View />
    </>
  );
}
