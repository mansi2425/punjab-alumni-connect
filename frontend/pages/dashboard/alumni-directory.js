// pages/dashboard/alumni-directory.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../lib/api'; // Our configured axios instance

const AlumniCard = ({ alumnus }) => (
  // Use the live, nested profile data
  <div className="p-4 bg-white rounded-lg shadow-md transition-transform hover:scale-105 hover:shadow-lg cursor-pointer">
    <h3 className="font-bold text-lg text-gray-800">{alumnus.first_name || alumnus.username}</h3>
    <p className="text-gray-600">{alumnus.profile.company || 'Company not specified'}</p>
    <p className="text-sm text-gray-500">Role: {alumnus.role}</p>
  </div>
);

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // This function runs once when the component is first loaded
    const fetchAlumni = async () => {
      try {
        // Use our API client to make a GET request to the new endpoint
        const response = await api.get('/users/alumni/');
        setAlumni(response.data); // Store the list of alumni in our state
      } catch (err) {
        setError('Failed to load alumni data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };
    fetchAlumni();
  }, []); // The empty array ensures this effect runs only once

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }
    
    if (alumni.length === 0) {
        return <p className="text-gray-500 text-center">No alumni found in the directory yet.</p>
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map(person => (
          // Link to the dynamic profile page using the user's ID
          <Link key={person.id} href={`/alumni/${person.id}`}>
            <AlumniCard alumnus={person} />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Alumni Directory</h1>
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}