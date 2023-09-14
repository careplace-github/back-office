// react
import React from 'react';
// next
import Head from 'next/head';
// layouts
import CompactLayout from 'src/layouts/compact';
// features
import { AuthVerifyEmailView } from 'src/features/auth';

// ----------------------------------------------------------------------

ResetPasswordPage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title>Verificar Email | Careplace Admin</title>
      </Head>

      <AuthVerifyEmailView />
    </>
  );
}
