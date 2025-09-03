import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import api from '../../../lib/api';
import { useNotification } from '../../../context/NotificationContext';

const StatCard = ({ title, value }) => (
  <Card>
    <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
    <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
  </Card>
);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({});
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const fetchData = async () => {
    // Only set loading to true on the initial fetch
    if (loading) {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                api.get('/institutions/analytics/'),
                api.get('/institutions/pending/')
            ]);
            setStats(statsRes.data);
            setPending(pendingRes.data);
        } catch (error) {
            addNotification('Failed to load admin data.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    } else {
        // For refreshes, just fetch the analytics
        const statsRes = await api.get('/institutions/analytics/');
        setStats(statsRes.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (institutionId) => {
    try {
      await api.post(`/institutions/${institutionId}/approve/`);
      addNotification('Institution approved successfully!', 'success');
      // Manually remove from list for instant UI feedback
      setPending(current => current.filter(inst => inst.id !== institutionId));
      // Refresh analytics data
      fetchData();
    } catch (error) {
      addNotification('Failed to approve institution.', 'error');
      console.error(error);
    }
  };

  const handleReject = async (institutionId) => {
    try {
      await api.post(`/institutions/${institutionId}/reject/`);
      addNotification('Institution rejected.', 'success');
      // Manually remove from the list for instant UI feedback
      setPending(current => current.filter(inst => inst.id !== institutionId));
    } catch (error) {
      addNotification('Failed to reject institution.', 'error');
      console.error(error);
    }
  };

  if (loading) {
    return <DashboardLayout><Spinner /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">State Super Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Approved Institutions" value={stats.total_institutions} />
        <StatCard title="Total Approved Alumni" value={stats.total_alumni} />
        <StatCard title="Total Approved Students" value={stats.total_students} />
      </div>

      <div className="mt-8">
        <Card title={`Pending Institution Applications (${pending.length})`}>
          {pending.length > 0 ? (
            <div className="space-y-4">
              {pending.map((inst) => (
                <div key={inst.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-md border">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-bold text-gray-800">{inst.name}</p>
                    <p className="text-sm text-gray-500">{inst.contact_person} - {inst.contact_email}</p>
                  </div>
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <Button variant="primary" onClick={() => handleApprove(inst.id)}>Approve</Button>
                    <Button variant="danger" onClick={() => handleReject(inst.id)}>Decline</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No pending applications to review.</p>
          )}
        </Card>
      </div>


    <div className="mt-8">
        <Card title="Management Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center font-semibold">
            {/* --- ADD THIS NEW LINK --- */}
            <Link href="/admin/super/colleges" className="block bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors">
              Manage Approved Colleges
            </Link>
            {/* The other links can be added here later */}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}