// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// features
import NewOrderView from 'src/features/orders/views/NewOrderView';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import axios from 'src/lib/axios';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function NewOrderPage({ order, services, caregivers, customers, patients }) {
  return (
    <>
      <Head>
        <title> Novo Pedido | Careplace Business </title>
      </Head>

      <DashboardLayout>
        <NewOrderView
          services={services}
          caregivers={caregivers}
          customers={customers}
          patients={patients}
        />
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

  // get caregivers
  const caregivers = await axios
    .get(`/caregivers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data);

  // get services
  const services = await axios.get(`/services`, {}).then(response => response.data.data);

  // get customers
  const customers = await axios
    .get('/customers', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data.data);

  // get patients
  const patients = await axios
    .get('/health-units/patients', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data.data);

  return {
    props: { services, caregivers, customers, patients },
  };
}
