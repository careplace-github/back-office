// next
import Head from 'next/head';
// layouts
import SimpleLayout from 'src/layouts/simple';
// view
import GetDemoView from 'src/features/demo/views/DemoView';

// ----------------------------------------------------------------------

GetDemoPage.getLayout = (page: React.ReactElement) => <SimpleLayout>{page}</SimpleLayout>;

// ----------------------------------------------------------------------

export default function GetDemoPage() {
  return (
    <>
      <Head>
        <title>Obter Demonstração | Careplace Business</title>
      </Head>
      <GetDemoView />
    </>
  );
}
