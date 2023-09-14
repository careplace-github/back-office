import { Session, User } from 'next-auth';

declare module 'next-auth' {
  interface Session extends User {
    accessToken: string;
    user: User;
  }

  interface JWT {
    accessToken: string;
    refreshToken?: string;

    user: User;
  }

  interface User {
    sub: string;

    name: string | null;
    email: string | null;
    phone?: string;
    picture?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    Groups?: any[];
    permissions?: string[];

    accessToken: string;
    refreshToken?: string;
    exp?: number;
  }
}
