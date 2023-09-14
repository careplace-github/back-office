/* eslint-disable */

import { User as AdapterUser, Session } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

import NextAuth from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '../../../lib/axios';
import { NextApiRequest, NextApiResponse } from 'next';
//

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    // Custom Credentials Provsuber
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials: Record<'email' | 'password', string> | undefined, req) => {
        try {
          // Implement your custom authentication logic here
          // Retrieve the user based on the provsubed credentials
          const { email, password } = credentials || {};
          if (!email || !password) {
            // Return null if credentials are missing
            return null;
          }

          let response = await axios.post(
            '/auth/signin',
            {
              email,
              password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const accessToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          let userDB;

          if (response) {
            const test = await axios.get('/auth/account', {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            });

            userDB = test.data;
          }

          if (userDB.sub) {
            // Add the user object and access token to the session
            const user = {
              id: userDB.sub,
              sub: userDB.sub,

              name: userDB.name,
              email: userDB.email,
              phone: userDB.phone,
              picture: userDB.picture,
              email_verified: userDB.email_verified,
              phone_verified: userDB.phone_verified,
              Groups: userDB.Groups,
              permissions: userDB.permissions,

              accessToken,
              refreshToken,
              exp: response.data.exp,
            };

            // Return the user object if authentication is successful
            return user; // Corrected here
          } else {
            return null;
          }
        } catch (error) {
          // Handle the error and return null
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
    // Other authentication provsubers can be added here
    // For example: Provsubers.Google({ ... }),
  ],
  callbacks: {
    jwt({ token, account, user }: { token: any; account: any; user: any }) {
      // Persist the OAuth access_token to the token right after signin

      if (user?.accessToken) {
        token = {
          accessToken: user.accessToken,
          refreshToken: user?.refreshToken,
          exp: user?.exp,

          user: {
            id: user.sub,
            sub: user.sub,

            name: user.name,
            email: user.email,
            phone: user.phone,
            picture: user.picture,
            email_verified: user.email_verified,
            phone_verified: user.phone_verified,
            Groups: user.Groups,
            permissions: user.permissions,
          },
        };

        return token;
      }

      if (token?.accessToken) {
        token = {
          accessToken: token.accessToken,
          refreshToken: token?.refreshToken,
          exp: token?.exp,

          user: {
            id: token.sub,
            sub: token.sub,

            name: token.name,
            email: token.email,
            phone: token.phone,
            picture: token.picture,
            email_verified: token.email_verified,
            phone_verified: token.phone_verified,
            Groups: token.Groups,
            permissions: token.permissions,
          },
        };

        return token;
      }

      return {};
    },
    async session({ session, token, user }: { session: any; token: any; user: AdapterUser }) {
      const expiresIn = token?.exp as number;

      const accessToken = token?.accessToken as string;

      if (!token?.accessToken) {
        return null;
      }

      let sessionUser = token?.user;
      let updateSession;

      try {
        updateSession = await axios
          .get('/auth/account', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(res => res.data);
      } catch (error) {
        console.error(error);
      }

      // If there is an error with the request logout the user
      if (updateSession?.error) {
        return null;
      }

      // Send properties to the client, like an access_token from a provsuber.
      sessionUser = {
        id: updateSession.sub,
        sub: updateSession.sub,

        name: updateSession.name,
        email: updateSession.email,
        phone: updateSession.phone,
        picture: updateSession.picture,
        email_verified: updateSession.email_verified,
        phone_verified: updateSession.phone_verified,
        Groups: updateSession.Groups,
        permissions: updateSession.permissions,
      };

      // Send properties to the client, like an access_token from a provsuber.
      const customSession = {
        ...session,
        user: sessionUser,
        accessToken,
        refreshToken: token.refreshToken,
        expires: expiresIn.toString(),
      };

      return customSession;
    },
    async redirect({ url, baseUrl }) {
      // After signin, redirect to '/app'
      // After signout, redirect to '/'
      return url.startsWith(baseUrl + '/auth/login')
        ? Promise.resolve(baseUrl + '/')
        : Promise.resolve(baseUrl + '/');
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/api/error',
  },
};

export default NextAuth(authOptions);
