// pages/admin/department/approvals.js
import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import api from '../../../lib/api';

export default function DepartmentApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/pending/');
      setPendingUsers(response.data);
    } catch (err) {
      setError('Failed to load pending users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      // Send a POST request to our new approval endpoint
      await api.post(`/users/${userId}/approve/`);
      // For immediate feedback, filter the approved user out of the list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to approve user.');
      console.error(err);
    }
  };
  
  // We'll add a reject function in the future
  const handleReject = (userId) => {
    console.log("Rejecting user:", userId);
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
  }

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (pendingUsers.length === 0) return <p className="text-gray-500 text-center">No pending applications to review.</p>;
    
    return (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md border">
              <div>
                <p className="font-bold">{user.first_name || user.username} ({user.email})</p>
                <p className="text-sm text-gray-500">Role requested: {user.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="primary" onClick={() => handleApprove(user.id)}>Approve</Button>
                <Button variant="danger" onClick={() => handleReject(user.id)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Department Approvals</h1>
        <p className="text-gray-600">Review pending applications for your department.</p>
      </div>
      <Card>{renderContent()}</Card>
    </DashboardLayout>
  );
}