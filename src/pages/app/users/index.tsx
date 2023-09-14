// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { UsersListView } from 'src/features/users';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function UsersListPage({ collaborators }) {
  return (
    <>
      <Head>
        <title> Colaboradores | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <UsersListView collaborators={collaborators} />
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

  // Permissions Guard
  if (!user?.permissions?.includes('users_view')) {
    // Redirect to forbidden page
    return {
      redirect: {
        destination: PATHS.page403,
        permanent: false,
      },
    };
  }

  const accessToken = session?.accessToken;

  const collaborators = await axios
    .get('/collaborators', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  const caregivers = await axios
    .get('/caregivers', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  const users = [...collaborators, ...caregivers];

  return {
    props: {
      collaborators: users,
    },
  };
}
