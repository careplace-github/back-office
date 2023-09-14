// next
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/lib/axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import { Session } from 'next-auth';

export default async function eventsRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = (await getServerSession(req, res, authOptions)) as Session | null;

    const accessToken = session?.accessToken;

    const eventId = req.query.id;

    if (req.method === 'GET') {
      const response = await axios.get(`/calendar/collaborators/events/${eventId}`, {
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
    if (req.method === 'PUT') {
      let updatedEvent: any = {};
      const event = req.body;

      const response = await axios.put(
        `/calendar/collaborators/events/${eventId}`,
        { ...event },
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

      if (response.data.error) {
        return res.status(401).json({
          error: response.data.error,
        });
      }

      updatedEvent = response.data;

      return res.status(200).json(updatedEvent);
    }
    if (req.method === 'DELETE') {
      const response = await axios.delete(`/calendar/collaborators/events/${eventId}`, {
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
