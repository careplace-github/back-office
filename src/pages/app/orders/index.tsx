// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { OrdersListView } from 'src/features/orders';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function OrdersPage({ orders }) {
  return (
    <>
      <Head>
        <title> Pedidos | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <OrdersListView orders={orders} />
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
  if (!user?.permissions?.includes('orders_view')) {
    // Redirect to forbidden page
    return {
      redirect: {
        destination: PATHS.page403,
        permanent: false,
      },
    };
  }

  const orders = await axios
    .get('/health-units/orders/home-care', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  return {
    props: { orders },
  };
}
