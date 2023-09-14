// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { CompanyProfileView } from 'src/features/company';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function CompanyProfilePage({ company }) {
  return (
    <>
      <Head>
        <title> A Minha Empresa | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <CompanyProfileView company={company} />
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

  const company = await axios
    .get('/auth/account', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data.health_unit);

  return {
    props: {
      company,
    },
  };
}
