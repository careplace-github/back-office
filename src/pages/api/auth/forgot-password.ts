// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// types
import { Session } from 'next-auth';

export default async function forgotPasswordRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    switch (req.method) {
      case 'POST': {
        const response = await axios.post(
          '/auth/send/forgot-password-code',

          { email }
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
