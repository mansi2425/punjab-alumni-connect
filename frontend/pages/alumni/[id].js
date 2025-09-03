// pages/alumni/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import api from '../../lib/api';
import RequestMentorshipModal from '../../components/dashboard/RequestMentorshipModal'; // <-- Import the new modal
import { useNotification } from '../../context/NotificationContext';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d={path} /></svg>
);

export default function AlumnusProfilePage() {
  const router = useRouter();
  const { id } = router.query; // Get the user ID from the URL, e.g., '2'
  const { addNotification } = useNotification();
  const [alumnus, setAlumnus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    // This effect runs whenever the 'id' from the URL changes.
    if (id) {
      const fetchAlumnus = async () => {
        setLoading(true);
        setError('');
        try {
          // Make an API call to our new dynamic backend endpoint
          const response = await api.get(`/users/${id}/`);
          setAlumnus(response.data);
        } catch (err) {
          setError('Could not find or load this alumnus profile.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAlumnus();
    }
  }, [id]);

  const handleSendRequest = async (message) => {
    try {
      // Send the request to our new backend endpoint
      await api.post('/mentorship/requests/', {
        mentor_id: id, // The ID of the alumnus from the URL
        initial_message: message,
      });
      setIsRequestModalOpen(false);
      addNotification('Mentorship request sent successfully!', 'success');
    } catch (err) {
      addNotification('Failed to send request. You may have already sent one.', 'error');
      console.error(err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }
    if (!alumnus) {
      return <p className="text-gray-500 text-center">No profile data available.</p>;
    }

    const { profile } = alumnus; // Extract the nested profile object

    return (
      <>
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 sm:mb-0 sm:mr-6 border-4 border-blue-200 flex items-center justify-center">
              <span className="text-4xl text-gray-500">{alumnus.first_name ? alumnus.first_name[0].toUpperCase() : alumnus.username[0].toUpperCase()}</span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{alumnus.first_name || alumnus.username}</h1>
              <p className="text-md text-gray-600 mt-1">{profile.headline || 'No headline.'}</p>
              <p className="text-sm text-gray-500 mt-2">{profile.location || 'No location.'}</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-auto">
              <Button onClick={() => setIsRequestModalOpen(true)}>Connect</Button>
            </div>
          </div>
        </Card>
        
        {/* The rest of the profile layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="About"><p className="text-gray-600">{profile.about || 'No information provided.'}</p></Card>
            <Card title="Experience"><p className="text-gray-500 italic">Feature coming soon.</p></Card>
          </div>
          <div className="space-y-6">
            <Card title="Education"><p className="text-gray-500 italic">Feature coming soon.</p></Card>
            <Card title="Skills"><p className="text-gray-500 italic">Feature coming soon.</p></Card>
          </div>
        </div>
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <Link href="/dashboard/alumni-directory" className="text-blue-600 hover:underline">
          &larr; Back to Directory
        </Link>
      </div>
      {renderContent()}
      {alumnus && (
        <RequestMentorshipModal
          mentorName={alumnus.first_name || alumnus.username}
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onSend={handleSendRequest}
        />
      )}
    </DashboardLayout>
  );
}