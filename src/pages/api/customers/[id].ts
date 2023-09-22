// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { Session } from 'next-auth';

export default async function customersRouter(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    const accessToken = session?.accessToken;

    const customer = req.body;

    if (req.method === 'PUT') {
      try {
        const customerId = req.query.id;
        const response = await axios.put(`/customers/${customerId}`, customer, {
          // Set authorization header bearer token
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,

            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        return res.status(200).json(response.data);
      } catch (error) {
        switch (error.response.data.error) {
          default:
            console.log(error.response.data);
            return res.status(500).json({ error: 'Internal server error' });
        }
      }
    }

    return res.status(500).json({ error: 'Internal server error' });

    // if (req.method === 'GET') {
    //   // TODO: GET CUSTOMER
    // }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
