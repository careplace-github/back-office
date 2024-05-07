// next
import Head from 'next/head';
// layouts
import CompactLayout from 'src/layouts/compact';
// features
import { AuthForgotPasswordView } from 'src/features/auth';

// ----------------------------------------------------------------------

ForgotPasswordPage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Head>
        <title>Forgot Password? | Careplace Admin</title>
      </Head>

      <AuthForgotPasswordView />
    </>
  );
}
