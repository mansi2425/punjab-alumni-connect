import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Link from 'next/link';

export default function DepartmentAdminDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Department Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Pending Approvals (Your Dept)">12</Card>
        <Card title="Total Alumni (Your Dept)">1,502</Card>
      </div>
      <div className="mt-8">
        <Card title="Primary Action">
          <Link href="/admin/department/approvals" className="block text-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 text-lg font-semibold">
            Approve Students & Alumni
          </Link>
        </Card>
      </div>
    </DashboardLayout>
  );
}