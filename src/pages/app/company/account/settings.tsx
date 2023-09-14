// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { CompanySettingsView } from 'src/features/company';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function CompanySettingsPage({ company, services }) {
  return (
    <>
      <Head>
        <title> Definições de Empresa | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <CompanySettingsView company={company} services={services} />
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
  if (!user?.permissions?.includes('admin_edit_company')) {
    // Redirect to forbidden page
    return {
      redirect: {
        destination: PATHS.page403,
        permanent: false,
      },
    };
  }

  const accessToken = session?.accessToken;

  const services = await axios.get('/services').then(response => response.data.data);

  const company = await axios
    .get('/auth/account', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data.company);

  return {
    props: {
      company,
      services,
    },
  };
}
