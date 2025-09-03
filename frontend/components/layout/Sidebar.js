// components/layout/Sidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';

// A simple SVG icon component for demonstration
const Icon = ({ d }) => (
  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

const NavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-2 mt-2 text-gray-700 rounded-lg transition-colors duration-200 
        ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`
      }
    >
      {children}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-grow px-4 py-2">
        <NavLink href="/dashboard">
          <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          Home
        </NavLink>
        <NavLink href="/dashboard/alumni-directory">
          <Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A6.995 6.995 0 0112 12c2.474 0 4.673.999 6.243 2.625" />
          Alumni Directory
        </NavLink>
        <NavLink href="/dashboard/events">
          <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          Events
        </NavLink>
        <NavLink href="/dashboard/jobs">
          <Icon d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          Jobs & Internships
        </NavLink>
        <NavLink href="/dashboard/requests">
          <Icon d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          My Requests
        </NavLink>
         <NavLink href="/dashboard/connections">
            <Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A6.995 6.995 0 0112 12c2.474 0 4.673.999 6.243 2.625" />
            My Connections
        </NavLink>
        
        {/* Profile Link at the bottom */}
        <div className="absolute bottom-0 w-56 left-4 mb-4">
           <NavLink href="/dashboard/profile">
              <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              My Profile
            </NavLink>
        </div>
      </nav>
    </aside>
  );
}