// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { NewUserView } from 'src/features/health-units';
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
        <NewUserView services={services} />
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

  const users = await axios
    .get('/collaborators', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  const services = await axios.get('/services').then(response => response.data.data);

  return {
    props: {
      services,
    },
  };
}
