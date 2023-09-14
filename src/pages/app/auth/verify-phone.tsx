// next
import Head from 'next/head';
// layouts
import CompactLayout from 'src/layouts/compact';

// features
import VerifyPhoneView from 'src/features/auth/views/VerifyPhoneView';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// routes
import { PATHS } from 'src/routes';
import axios from 'src/lib/axios';

// ----------------------------------------------------------------------

VerifyPhonePage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function VerifyPhonePage() {
  return (
    <>
      <Head>
        <title>Verificar telemóvel | Careplace Business </title>
      </Head>

      <VerifyPhoneView />
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
    props: {},
  };
}
