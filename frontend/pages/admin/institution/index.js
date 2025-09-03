import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import Link from 'next/link';
import api from '../../../lib/api';
import { useNotification } from '../../../context/NotificationContext';

const StatCard = ({ title, value }) => (
  <Card>
    <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
    <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
  </Card>
);

export default function InstitutionAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/institutions/my-institution/analytics/');
        setStats(response.data);
      } catch (error) {
        addNotification('Failed to load dashboard data. You may not have permissions.', 'error');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return <DashboardLayout><Spinner /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800">{stats.institution_name}</h1>
      <p className="text-gray-600 mb-6">Institution Administration Portal</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Approved Alumni" value={stats.total_alumni} />
        <StatCard title="Total Approved Students" value={stats.total_students} />
        <StatCard title="Pending User Approvals" value={stats.pending_approvals} />
      </div>

      <div className="mt-8">
        <Card title="Management Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center font-semibold">
            
            {/* --- THIS IS THE CRITICAL FIX --- */}
            {/* The link now correctly points to the institution-level approvals page */}
            <Link href="/admin/institution/user-approvals" className="block bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
              View User Approvals
            </Link>
            {/* --- END OF FIX --- */}
            
            <Link href="/admin/institution/manage-admins" className="block bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">Manage Department Admins</Link>
            <div className="bg-gray-300 text-gray-600 p-4 rounded-lg cursor-not-allowed">Manage Departments (Coming Soon)</div>
            <div className="bg-gray-300 text-gray-600 p-4 rounded-lg cursor-not-allowed">Send Announcement (Coming Soon)</div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}