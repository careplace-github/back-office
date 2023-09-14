// next
import Head from 'next/head';
// layouts
import LoginLayout from 'src/layouts/login';
// features
import { AuthLoginView } from 'src/features/auth';
// routes
import { PATHS } from 'src/routes';
// next-auth
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';

// ----------------------------------------------------------------------

LoginPage.getLayout = (page: React.ReactElement) => <LoginLayout>{page}</LoginLayout>;

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Head>
        <title> Login | Careplace Business </title>
      </Head>

      <AuthLoginView />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // --------------- Guest Guard ---------------
  if (session) {
    // Redirect the user to the login page
    return {
      redirect: {
        destination: PATHS.root,
        permanent: false,
      },
    };
  }
  // --------------- Guest Guard ---------------

  return { props: {} };
}
