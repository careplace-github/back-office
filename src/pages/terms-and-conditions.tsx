// next
import Head from 'next/head';
// layouts
import SimpleLayout from 'src/layouts/simple/SimpleLayout';
// features
import { TermsAndConditionsView } from 'src/features/common';

// ----------------------------------------------------------------------

TermsAndConditionsPage.getLayout = (page: React.ReactElement) => (
  <SimpleLayout>{page}</SimpleLayout>
);

// ----------------------------------------------------------------------

export default function TermsAndConditionsPage() {
  return (
    <>
      <Head>
        <title>Termos e Condições | Careplace</title>
      </Head>

      <TermsAndConditionsView />
    </>
  );
}
