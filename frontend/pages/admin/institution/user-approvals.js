import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // <-- Step 1: Import the router
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import api from '../../../lib/api';
import { useNotification } from '../../../context/NotificationContext';

export default function InstitutionApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const router = useRouter(); // <-- Step 2: Initialize the router

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/users/institution-pending/');
      setPendingUsers(response.data);
    } catch (error) {
      addNotification('Failed to load pending users.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await api.post(`/users/${userId}/approve/`);
      addNotification('User approved successfully!', 'success');
      
      // --- Step 3: THIS IS THE CRITICAL FIX ---
      // After successfully approving, navigate the admin back to their main dashboard.
      // This will cause the dashboard to re-fetch its data.
      router.push('/admin/institution/');
      // --- END OF FIX ---

    } catch (error) {
      addNotification('Failed to approve user.', 'error');
    }
  };

  if (loading) {
    return <DashboardLayout><Spinner /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Institution User Approvals</h1>
      <Card title={`Pending Applications (${pendingUsers.length})`}>
        {pendingUsers.length > 0 ? (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-md border">
                <div className="mb-2 sm:mb-0">
                  <p className="font-bold text-gray-800">{user.first_name || user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>

                  <p className="text-sm text-gray-500">Department: {user.profile?.department || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <Button variant="primary" onClick={() => handleApprove(user.id)}>Approve</Button>
                  <Button variant="danger">Decline</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No pending user applications for your institution.</p>
        )}
      </Card>
    </DashboardLayout>
  );
}