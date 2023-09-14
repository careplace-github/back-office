import { useRouter } from 'next/router';
import { useEffect } from 'react';
// routes
import { PATHS } from 'src/routes';

export default function Account() {
  const router = useRouter();

  useEffect(() => {
    router.push(PATHS.account.settings);
  }, []);

  return null;
}
