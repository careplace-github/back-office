// next
import Head from 'next/head';
// layouts
import CompactLayout from 'src/layouts/compact';
// features
import { ComingSoonView } from 'src/features/common';

// ----------------------------------------------------------------------

ComingSoonPage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function ComingSoonPage() {
  return (
    <>
      <Head>
        <title>Brevemente... | Careplace</title>
      </Head>

      <ComingSoonView />
    </>
  );
}
