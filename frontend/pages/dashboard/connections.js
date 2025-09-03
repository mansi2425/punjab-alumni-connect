import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ConnectionCard = ({ connection, currentUser }) => {
  const { shared_contact_info, shared_message, request } = connection;
  
  // --- THIS IS THE KEY CHANGE ---
  // The "other person" is now found by looking inside the nested 'request' object.
  const connected_user = currentUser?.id === request.mentor.id ? request.requester : request.mentor;
  // --- END OF CHANGE ---

  // Defensive check in case data is missing
  if (!connected_user) {
    return <Card>Error displaying connection.</Card>;
  }

  return (
    <Card>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl text-gray-500">
            {connected_user.first_name ? connected_user.first_name[0].toUpperCase() : connected_user.username[0].toUpperCase()}
          </span>
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg">{connected_user.first_name || connected_user.username}</h3>
          <p className="text-sm text-gray-600">{connected_user.profile?.headline}</p>
        </div>
      </div>
      
      {/* This logic now correctly determines if the viewer is the student (requester) */}
      {currentUser?.id === request.requester.id ? (
        <>
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-sm text-gray-700">Contact Information from Mentor:</h4>
            <p className="text-gray-800 bg-gray-100 p-3 rounded mt-1 font-mono">{shared_contact_info}</p>
          </div>
          {shared_message && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm text-gray-700">A Message from Your Mentor:</h4>
              <blockquote className="text-gray-600 bg-blue-50 p-3 rounded mt-1 italic">
                "{shared_message}"
              </blockquote>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 italic">You have accepted this connection. The mentee can now see the contact info you provided.</p>
        </div>
      )}
    </Card>
  );
};

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await api.get('/mentorship/connections/');
        setConnections(response.data);
      } catch (err) {
        console.error("Failed to load connections:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchConnections();
    }
  }, [user]);

  const renderContent = () => {
    if (loading || !user) return <Spinner />;
    if (connections.length === 0) return <p className="text-gray-500 text-center">You have no active connections yet.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connections.map(conn => <ConnectionCard key={conn.id} connection={conn} currentUser={user} />)}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">My Connections</h1>
      {renderContent()}
    </DashboardLayout>
  );
}