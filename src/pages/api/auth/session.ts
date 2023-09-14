// next
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';

import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import axios from '../../../lib/axios';
import fetch from '../../../lib/fetch';

export default async function sessionRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const session = req.session;
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    // const accessToken = req.headers.authorization?.split(' ')[1];
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    // Check if the token has expired
    const expirationTimestamp = new Date(session.expires);
    if (expirationTimestamp && Date.now() > expirationTimestamp.getTime()) {
      return res.status(401).json({
        error: 'Token has expired',
      });
    }

    const response = await axios.get('/auth/account', {
      // Set authorization header bearer token
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken,

        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    if (response.data.error) {
      if (response.data.error.type === 'UNAUTHORIZED') {
        // NextAuth logout
        await fetch('/api/auth/signout', {
          method: 'POST',
        });
      }

      return res.status(401).json({
        error: response.data.error,
      });
    }

    const user = {
      name: response.data.name,
      email: response.data.email,
      profile_picture: response.data.profile_picture,
      role: response.data.role,
      permissions: response.data.permissions,
      health_unit: {
        _id: response.data.health_unit?._id,
        business_profile: {
          logo: response.data.health_unit?.business_profile?.logo,
          name: response.data.health_unit?.business_profile?.name,
        },
      },
    };

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', message: error });
  }
}
