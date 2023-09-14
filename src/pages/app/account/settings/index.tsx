// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { UserSettingsView } from 'src/features/account';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function UserSettingsPage({ userData }) {
  return (
    <>
      <Head>
        <title> Definições de Conta | Careplace Business</title>
      </Head>

      <DashboardLayout>
        <UserSettingsView user={userData} />
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

  const user = await axios
    .get('/auth/account', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  return {
    props: {
      userData: user,
    },
  };
}
