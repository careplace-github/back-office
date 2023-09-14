// next
import Head from 'next/head';

// layouts
import CompactLayout from 'src/layouts/compact';
// features
import { AuthVerifyCodeView } from 'src/features/auth';

// ----------------------------------------------------------------------

VerifyCodePage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function VerifyCodePage() {
  return (
    <>
      <Head>
        <title>Verificar Código | Careplace Business </title>
      </Head>

      <AuthVerifyCodeView />
    </>
  );
}
