import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// components
import LoadingScreen from 'src/components/loading-screen';
//
import { PATHS } from 'src/routes/paths';
import { useSession } from 'next-auth/react';

// ----------------------------------------------------------------------
type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: user, status } = useSession();

  const isAuthenticated = status === 'authenticated';

  const isLoading = status === 'loading';

  // Return loading screen if auth context is not initialized
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login page if user is not authenticated
  if (!isAuthenticated && !user?.email) {
    const { push } = useRouter();

    // Redirect to login page
    useEffect(() => {
      push(PATHS.auth.login);
    }, [push]);

    return <LoadingScreen />;
  }

  return <> {children} </>;
}
