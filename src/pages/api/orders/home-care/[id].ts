// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { Session } from 'next-auth';

export default async function HomeCareOrdersRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    const accessToken = session?.accessToken;

    const order = req.body;

    const orderId = req.query.id;

    if (req.method === 'GET') {
      const response = await axios.get(`/health-units/orders/home-care/${orderId}`, {
        // Set authorization header bearer token
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,

          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (response.data.error) {
        return res.status(401).json({
          error: response.data.error,
        });
      }

      return res.status(200).json(response.data);
    }
    if (req.method === 'PUT') {
      try {
        const response = await axios.put(`/health-units/orders/home-care/${orderId}`, order, {
          // Set authorization header bearer token
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,

            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        return res.status(200).json('Success');
      } catch (error) {
        switch (error.response.data.error) {
          default:
            return res.status(500).json({ error: 'Internal server error' });
        }
      }
    }

    if (req.method === 'DELETE') {
      try {
        const response = await axios.delete(`/health-units/orders/home-care/${orderId}`, {
          // Set authorization header bearer token
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,

            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        return res.status(200).json('Success');
      } catch (error) {
        switch (error.response.data.error) {
          default:
            return res.status(500).json({ error: 'Internal server error' });
        }
      }
    }

    // This will be returned if req.method is not 'POST'
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
