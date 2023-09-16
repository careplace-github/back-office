// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { HealthUnitsListView } from 'src/features/health-units';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------
type props = {
  healthUnits: any;
};

export default function UsersListPage({ healthUnits }: props) {
  return (
    <>
      <Head>
        <title> Health Units | Careplace Admin </title>
      </Head>

      <DashboardLayout>
        <HealthUnitsListView healthUnits={healthUnits} />
      </DashboardLayout>
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Check if the user is not authenticated
  if (!session) {
    // Redirect the user to the login page
    return {
      redirect: {
        destination: PATHS.auth.login,
        permanent: false,
      },
    };
  }

  const user = session?.user;

  const accessToken = session?.accessToken;

  const healthUnits = await axios
    .get('/health-units/search', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        documentsPerPage: 100,
      },
    })
    .then(response => response.data.data);

  console.log('Health Units', healthUnits);

  return {
    props: {
      healthUnits,
    },
  };
}
