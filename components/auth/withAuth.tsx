import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface AuthProps {
  needsOrg?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { needsOrg = true }: AuthProps = {}
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/check');
          const data = await response.json();

          if (!data.authorized) {
            router.push('/auth/signin');
            return;
          }

          if (needsOrg && data.needsOrg) {
            router.push('/dashboard/organization/new');
            return;
          }

          setIsAuthorized(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          toast.error('Authentication failed');
          router.push('/auth/signin');
        }
      };

      checkAuth();
    }, [router, needsOrg]);

    if (!isAuthorized) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}
