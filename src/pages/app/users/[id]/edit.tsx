// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { EditUserView } from 'src/features/users';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function EditUserPage({ collaborator, services }) {
  return (
    <>
      <Head>
        <title> Editar Colaborador | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <EditUserView collaborator={collaborator} services={services} />
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
  if (!user?.permissions?.includes('users_edit')) {
    // Redirect to forbidden page
    return {
      redirect: {
        destination: PATHS.page403,
        permanent: false,
      },
    };
  }

  const userId = context.params.id;

  let collaborator = null;

  try {
    collaborator = await axios
      .get(`/collaborators/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => response.data);
  } catch (error) {
    if (error.response.status === 404) {
      const caregiver = await axios
        .get(`/caregivers/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(response => response.data);

      collaborator = caregiver;
    }
  }

  const services = await axios.get('/services').then(response => response.data.data);

  return {
    props: {
      collaborator,
      services,
    },
  };
}
