// next
import Head from 'next/head';
// layouts
import MainLayout from 'src/layouts/main';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// PATHS
import { PATHS } from 'src/routes';
// features
import { FaqsView } from 'src/features/common';

// ----------------------------------------------------------------------

export default function FAQsPage() {
  return (
    <>
      <Head>
        <title>Suporte | Careplace Admin</title>
      </Head>
      <MainLayout>
        <FaqsView />
      </MainLayout>
    </>
  );
}
