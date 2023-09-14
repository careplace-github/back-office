// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { ViewUserView } from 'src/features/users';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function ViewUserPage({ currentUser, services, caregivers }) {
  return (
    <>
      <Head>
        <title> Ver Colaborador | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <ViewUserView currentUser={currentUser} services={services} caregivers={caregivers} />
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

  const userId = context.params.id;

  let currentUser = null;

  try {
    const collaborator = await axios
      .get(`/collaborators/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => response.data);

    currentUser = collaborator;
  } catch (error) {
    if (error.response.status === 404) {
      const caregiver = await axios
        .get(`/caregivers/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(response => response.data);

      currentUser = caregiver;
    }
  }

  const caregivers = await axios
    .get(`/caregivers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  const services = await axios.get('/services').then(response => response.data.data);

  return {
    props: {
      currentUser,
      services,
      caregivers,
    },
  };
}
