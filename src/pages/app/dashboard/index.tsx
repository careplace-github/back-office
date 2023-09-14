//
import React from 'react';
// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { DashboardView } from 'src/features/dashboard';
// lib
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title> Dashboard | Careplace Business </title>
      </Head>
      <DashboardLayout>
        <DashboardView />
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const previousUrl = context.req.headers.referer;

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

  // Get the protocol ('http' or 'https')
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  // Get the host (like 'localhost:3000')
  const host = context.req.headers['x-forwarded-host'] || context.req.headers.host;
  // Construct the full URL for PATHS.auth.login
  const fullLoginUrl = `${protocol}://${host}${PATHS.auth.login}`;

  if (previousUrl === fullLoginUrl && !user?.permissions?.includes('dashboard_view')) {
    return {
      redirect: {
        destination: PATHS.company.account,
        permanent: false,
      },
    };
  }

  // Permissions Guard
  if (!user?.permissions?.includes('dashboard_view')) {
    // Redirect to forbidden page
    return {
      redirect: {
        destination: PATHS.page403,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
