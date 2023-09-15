// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { NewHealthUnitView } from 'src/features/health-units';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function NewUserPage({ services }) {
  return (
    <>
      <Head>
        <title> Add Health Unit | Careplace Admin </title>
      </Head>
      <DashboardLayout>
        <NewHealthUnitView services={services} healthUnit={undefined} />
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
      services,
    },
  };
}
