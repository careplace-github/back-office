// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { Session } from 'next-auth';

export default async function HealthUnitEventSeriesRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    const accessToken = session?.accessToken;

    const eventSeriesId = req.query.id;

    if (req.method === 'GET') {
      const response = await axios.get(`/calendar/health-units/event-series/${eventSeriesId}`, {
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
    if (req.method === 'PUT') {
      let updatedEvent: any = {};
      const eventSeries = req.body;

      const response = await axios.put(
        `/calendar/health-units/event-series/${eventSeriesId}`,
        { ...eventSeries },
        {
          // Set authorization header bearer token
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,

            Authorization: `Bearer ${accessToken}`,
          },

          withCredentials: true,
        }
      );

      updatedEvent = response.data;

      return res.status(200).json(updatedEvent);
    }

    if (req.method === 'DELETE') {
      const response = await axios.delete(`/calendar/health-units/event-series/${eventSeriesId}`, {
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

      const deletedEvent = response.data;

      return res.status(200).json(deletedEvent);
    }

    // This will be returned if req.method is not 'POST'
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
