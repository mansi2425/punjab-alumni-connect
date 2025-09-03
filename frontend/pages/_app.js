// pages/_app.js
import '../styles/globals.css';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { NotificationProvider } from '../context/NotificationContext'; 

const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/alumni/[id]', // The dynamic profile page is also protected
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isProtectedRoute = protectedRoutes.some(path => {
    // A simple check for exact match or startsWith for dashboard/admin
    if (path.includes('[')) return router.pathname.startsWith('/alumni/');
    return router.pathname.startsWith(path);
  });

  return (
    <NotificationProvider>
    <AuthProvider>
      {isProtectedRoute ? (
        <ProtectedRoute>
          {/* Dashboard pages handle their own layout, so we don't need <Layout> here */}
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        // Public pages get the simple layout
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
    </NotificationProvider>
  );
}

export default MyApp;