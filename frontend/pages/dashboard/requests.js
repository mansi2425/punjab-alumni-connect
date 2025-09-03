import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import IncomingRequestCard from '../../components/dashboard/IncomingRequestCard';
import OutgoingRequestCard from '../../components/dashboard/OutgoingRequestCard';
import AcceptRequestModal from '../../components/dashboard/AcceptRequestModal';
import Button from '../../components/ui/Button';

// A helper component for the tab buttons
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
      isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

export default function RequestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addNotification } = useNotification();
  
  // State to manage which main view is active ('incoming' or 'outgoing')
  const [mainTab, setMainTab] = useState('incoming');
  // State to manage which filter is active for the 'outgoing' view
  const [subTab, setSubTab] = useState('pending');

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const viewType = mainTab;
      // Pass the sub-tab status only when viewing outgoing requests
      const status = viewType === 'outgoing' ? subTab : 'pending';
      const response = await api.get(`/mentorship/requests/?view=${viewType}&status=${status}`);
      setRequests(response.data);
    } catch (err) {
      setError('Failed to load requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Set the initial main tab once the user object is available
  useEffect(() => {
    if (user) {
      setMainTab(user.role === 'alumni' ? 'incoming' : 'outgoing');
    }
  }, [user]);

  // Re-fetch data whenever the user or any tab changes
  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, mainTab, subTab]);

  const handleDecline = async (requestId) => {
    try {
      await api.post(`/mentorship/requests/${requestId}/respond/`, { status: 'declined' });
      addNotification('Request declined successfully!', 'success');
      setRequests(current => current.filter(req => req.id !== requestId));
    } catch (err) {
      addNotification('Failed to decline request.', 'error');
    }
  };
  
  const handleOpenAcceptModal = (request) => {
    setSelectedRequest(request);
    setIsAcceptModalOpen(true);
  };

  const handleConfirmAccept = async (connectionData) => {
    try {
      await api.post(`/mentorship/requests/${selectedRequest.id}/respond/`, {
        status: 'accepted',
        shared_contact_info: connectionData.shared_contact_info,
        shared_message: connectionData.shared_message,
      });
      addNotification('Request accepted! A connection has been made.', 'success');
      setIsAcceptModalOpen(false);
      setRequests(current => current.filter(req => req.id !== selectedRequest.id));
      setSelectedRequest(null);
    } catch (err) {
      addNotification('Failed to accept request.', 'error');
    }
  };

  const renderContent = () => {
    if (loading || !user) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    // Logic for the "Requests to Me" (Inbox) view
    if (mainTab === 'incoming') {
      return (
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map(req => <IncomingRequestCard key={req.id} request={req} onAccept={() => handleOpenAcceptModal(req)} onDecline={() => handleDecline(req.id)} />)
          ) : (
            <p className="text-gray-500 mt-6 text-center">You have no pending mentorship requests.</p>
          )}
        </div>
      );
    }

    // Logic for the "My Sent Requests" (Sent Items) view
    if (mainTab === 'outgoing') {
      return (
        <div>
          <div className="flex space-x-2 border-b mb-4 pb-2">
            <TabButton label="Pending" isActive={subTab === 'pending'} onClick={() => setSubTab('pending')} />
            <TabButton label="Accepted" isActive={subTab === 'accepted'} onClick={() => setSubTab('accepted')} />
            <TabButton label="Declined" isActive={subTab === 'declined'} onClick={() => setSubTab('declined')} />
          </div>
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map(req => <OutgoingRequestCard key={req.id} request={req} />)
            ) : (
              <p className="text-gray-500 mt-6 text-center">You have no {subTab} requests in this category.</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">My Mentorship Activity</h1>
      <div className="flex space-x-2 mb-4">
        {/* The "Incoming" tab is now correctly hidden for students */}
        {user && user.role === 'alumni' && (
          <TabButton label="Requests to Me" isActive={mainTab === 'incoming'} onClick={() => setMainTab('incoming')} />
        )}
        <TabButton label="My Sent Requests" isActive={mainTab === 'outgoing'} onClick={() => setMainTab('outgoing')} />
      </div>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      
      {renderContent()}

      <AcceptRequestModal request={selectedRequest} isOpen={isAcceptModalOpen} onClose={() => setIsAcceptModalOpen(false)} onConfirm={handleConfirmAccept} />
    </DashboardLayout>
  );
}