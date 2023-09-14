// next
import Head from 'next/head';
// layouts
import SimpleLayout from 'src/layouts/simple/SimpleLayout';
// features
import { PrivacyPolicyView } from 'src/features/common';

// ----------------------------------------------------------------------

PrivacyPolicyPage.getLayout = (page: React.ReactElement) => <SimpleLayout>{page}</SimpleLayout>;

// ----------------------------------------------------------------------

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Política de Privacidade | Careplace</title>
      </Head>

      <PrivacyPolicyView />
    </>
  );
}
