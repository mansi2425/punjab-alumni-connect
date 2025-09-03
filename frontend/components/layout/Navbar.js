// components/layout/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router'; // <-- Step 1: Import the router
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter(); // <-- Step 2: Initialize the router

  const handleLogout = () => {
    logout(); // Call the context's logout function
    router.push('/login'); // <-- Step 3: Manually redirect to the login page
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Punjab Alumni Connect
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700">Welcome, {user.first_name || user.username}!</span>
              {/* Step 4: Call our new handler */}
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link href="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}