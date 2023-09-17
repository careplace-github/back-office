// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { Session } from 'next-auth';

export default async function ordersRoute(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    const accessToken = session?.accessToken;

    const customer_id = req.query.customer as string;

    const connect_account_id = req.query.connectAccount as string;

    if (req.method === 'GET') {
      try {
        const response = await axios.get(`/payments/customers/${customer_id}`, {
          // Set authorization header bearer token
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,

            Authorization: `Bearer ${accessToken}`,
          },
          params: req.query,
          withCredentials: true,
        });
        return res.status(200).json(response.data);
      } catch (error) {
        switch (error.response.data.error) {
          case 'EMAIL_ALREADY_EXISTS':
            return res.status(400).json({ error: 'EMAIL_ALREADY_EXISTS' });

          default:
            return res.status(500).json({ error: 'Internal server error' });
        }
      }
    }

    if (req.method === 'DELETE') {
      try {
        const response = await axios.delete(`/payments/customers/${customer_id}`, {
          // Set authorization header bearer token
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,

            Authorization: `Bearer ${accessToken}`,
          },
          params: req.query,
          withCredentials: true,
        });
        return res.status(200).json(response.data);
      } catch (error) {
        switch (error.response.data.error) {
          case 'EMAIL_ALREADY_EXISTS':
            return res.status(400).json({ error: 'EMAIL_ALREADY_EXISTS' });

          default:
            return res.status(500).json({ error: 'Internal server error' });
        }
      }
    }

    // This will be returned if the method doesn't match the ones above
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
