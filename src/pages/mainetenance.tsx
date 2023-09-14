// next
import Head from 'next/head';
// layouts
import CompactLayout from 'src/layouts/compact';
// features
import { MaintenanceView } from 'src/features/common';

// ----------------------------------------------------------------------

MaintenancePage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function MaintenancePage() {
  return (
    <>
      <Head>
        <title>Manutenção | Careplace Admin</title>
      </Head>

      <MaintenanceView />
    </>
  );
}
