// components/auth/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is determined and the user is not authenticated, redirect.
    if (user === null && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // While checking, or if redirecting, show a loading spinner.
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // If the user is authenticated, render the page content.
  return children;
}