import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATHS } from 'src/routes';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    push(PATHS.company.account);
  }, [pathname]);

  return null;
}
