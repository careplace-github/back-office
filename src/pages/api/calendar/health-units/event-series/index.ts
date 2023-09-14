// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// types
import { ICalendarEvent } from 'src/types/calendar';
import { Session } from 'next-auth';

export default async function eventSeriesRoute(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    const user = session?.user;

    const accessToken = session?.accessToken;

    if (req.method === 'GET') {
      const response = await axios.get('/calendar/health-units/event-series', {
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

      const eventSeries = response.data;

      return res.status(200).json(eventSeries);
    }
    if (req.method === 'POST') {
      const response = await axios.post('/calendar/health-units/event-series', req.body, {
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

      const event = response.data;

      return res.status(200).json(event);
    }

    // This will be returned if req.method is not 'POST'
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
