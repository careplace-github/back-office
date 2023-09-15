// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { ViewHealthUnitView } from 'src/features/health-units';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function ViewUserPage({ healthUnit, services }) {
  return (
    <>
      <Head>
        <title> View Health Unit | Careplace Admin </title>
      </Head>

      <DashboardLayout>
        <ViewHealthUnitView healthUnit={healthUnit} services={services} />
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

  const accessToken = session?.accessToken;

  const healthUnitId = context.params.id;

  const healthUnit = await axios
    .get(`/health-units/${healthUnitId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  const services = await axios
    .get('/services', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        documentsPerPage: 100,
      },
    })
    .then(response => response.data.data);

  return {
    props: {
      healthUnit,
      services,
    },
  };
}
