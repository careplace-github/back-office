// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// types
import { Session } from 'next-auth';

export default async function changePhoneRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    const { phone } = req.body;

    const accessToken = session?.accessToken; // Type assertion

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
        const response = await axios.post('/auth/account/change-phone', { phone }, config);
        return res.status(200).json({ success: true });
      }
      default:
        return res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
