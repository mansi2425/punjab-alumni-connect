// pages/dashboard/profile.js
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Spinner from '../../components/ui/Spinner';
import EditProfileModal from '../../components/dashboard/EditProfileModal';
import api from '../../lib/api';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { addNotification } = useNotification();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSaveProfile = async (formData) => {
    console.log("Profile Page Checkpoint: Received data from modal:", formData);
    try {
      await api.patch('/users/me/', formData);
      await refreshUser();
      setIsEditModalOpen(false);
       // --- Step 3: Show a success notification ---
      addNotification('Profile updated successfully!', 'success');
      setError('');
    } catch (err) {
      console.error(err);
      addNotification('Failed to update profile. Please try again.', 'error');
    }
  };

  if (!user) {
    return <DashboardLayout><Spinner /></DashboardLayout>;
  }

  const { profile } = user;

  return (
    <DashboardLayout>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
      
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-center">
          {/* --- ALIGNMENT FIX 1: Added flex, items-center, justify-center --- */}
          <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 sm:mb-0 sm:mr-6 border-4 border-blue-200 flex items-center justify-center">
             <span className="text-4xl text-gray-500">{user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}</span>
          </div>

          {/* --- ALIGNMENT FIX 2: Added text-center for mobile, sm:text-left for desktop --- */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{user.first_name || user.username}</h1>
            <p className="text-md text-gray-600 mt-1">{profile.headline || 'No headline provided.'}</p>
            <p className="text-sm text-gray-500 mt-2">{profile.location || 'No location provided.'}</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            <Button onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="About"><p className="text-gray-600 ...">{profile.about || 'Your "About" section will appear here...'}</p></Card>
          <Card title="Experience"><p className="text-gray-500 italic">Feature coming soon.</p></Card>
        </div>
        <div className="space-y-6">
          <Card title="Education"><p className="text-gray-500 italic">Feature coming soon.</p></Card>
          <Card title="Skills">
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.split(',').map(skill => (
                  <span key={skill.trim()} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Your skills will be displayed here once you add them.</p>
            )}
          </Card>
          {/* --- END OF FIX --- */}
        </div>
      </div>

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </DashboardLayout>
  );
}