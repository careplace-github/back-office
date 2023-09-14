// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// types
import { Session } from 'next-auth';

export default async function verifyConfirmPhoneCodeRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    const accessToken = session?.accessToken; // Type assertion

    const { code } = req.body;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };

    switch (req.method) {
      case 'POST': {
        const response = await axios.post(
          '/auth/verify/confirm-phone-code',

          { code },

          config
        );

        return res.status(response.status).json(response.data);
      }
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
