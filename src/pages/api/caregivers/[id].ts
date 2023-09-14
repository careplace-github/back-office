// next
import { NextApiRequest, NextApiResponse } from 'next';
import { AxiosError } from 'axios'; // Import AxiosError type
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

    const userId = req.query.id as string;

    const user = req.body;

    if (req.method === 'PUT') {
      let response = await axios.put(`/caregivers/${userId}`, user, {
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

      response = response.data;

      return res.status(200).json(response);
    }

    if (req.method === 'DELETE') {
      let response = await axios.delete(`/caregivers/${userId}`, {
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

      response = response.data;

      return res.status(200).json(response);
    }

    // This will be returned if the method doesn't match the ones above
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res
      .status(error.response && error.response.status ? error.response.status : 500)
      .json(error.response.data);
  }
}
