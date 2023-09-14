// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { CalendarView } from 'src/features/calendar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function CalendarPage({ caregivers }) {
  return (
    <>
      <Head>
        <title> Agendamentos | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <CalendarView caregivers={caregivers} />
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

  const caregivers = await axios
    .get(`/caregivers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  return {
    props: {
      caregivers,
    },
  };
}
