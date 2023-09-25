// /admin/payments/health-units/:id/external-accounts

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

    const healthUnitId = req.query.healthUnit as string;
    const externalAccount = req.body;

    if (req.method === 'GET') {
      let response = await axios.get(`/payments/health-units/${healthUnitId}/external-accounts`, {
        // Set authorization header bearer token
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
          'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (response.data.error) {
        console.log('error --->', error.data);
        return res.status(401).json({
          error: response.data.error,
        });
      }

      response = response.data;

      return res.status(200).json(response);
    }

    if (req.method === 'POST') {
      let response = await axios.post(
        `/payments/health-units/${healthUnitId}/external-accounts`,
        {
          ...externalAccount,
        },
        {
          // Set authorization header bearer token
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
            'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.error) {
        return res.status(401).json({
          error: response.data.error,
        });
      }

      response = response.data;

      return res.status(200).json(response);
    }

    // This will be returned if the method doesn't match the ones above
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
