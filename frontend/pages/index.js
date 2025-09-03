// pages/index.js
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Punjab Alumni <span className="text-blue-600">Connect</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Reconnect with your roots. Power your future.
        </p>
        <div className="mt-8 space-x-4">
          <Link href="/login" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
            Login
          </Link>
          <Link href="/register" className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}