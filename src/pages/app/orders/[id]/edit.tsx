// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import { OrderDetailEditView } from 'src/features/orders';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function OrderDetailPage({ order, services, caregivers }) {
  return (
    <>
      <Head>
        <title> Editar Pedido | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <OrderDetailEditView order={order} services={services} caregivers={caregivers} />
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

  // Get the id of the order from the query params
  const { id } = context.params;

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

  const accessToken = session?.accessToken;

  const order = await axios
    .get(`/health-units/orders/home-care/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  const caregivers = await axios
    .get(`/caregivers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  const services = await axios.get(`/services`, {}).then(response => response.data.data);

  return {
    props: { order, services, caregivers },
  };
}
