'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setAuthenticated(true);
      } catch (err) {
        setAuthenticated(false);
        const publicPaths = ['/login', '/register', '/confirm-email', '/'];
        if (!publicPaths.includes(pathname)) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [pathname, router]);

  // El Nav Bar se mantiene en el Layout, aquí solo controlamos la visibilidad del contenido
  const publicPaths = ['/login', '/register', '/confirm-email', '/'];
  if (publicPaths.includes(pathname)) return <>{children}</>;
  
  if (loading) return <div style={{background:'#001a2c', height:'80vh'}} />;
  return authenticated ? <>{children}</> : null;
}
