// pages/admin/institution/manage-admins.js
import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

// Mock data for existing department admins
const initialAdmins = [
  { id: 'dept_cse', name: 'Prof. Gupta', department: 'Computer Science & Engineering', email: 'gupta@pec.edu' },
  { id: 'dept_mech', name: 'Dr. Sharma', department: 'Mechanical Engineering', email: 'sharma@pec.edu' },
];

export default function ManageAdmins() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // State to manage the "Add New Admin" form
  const [newAdminData, setNewAdminData] = useState({ name: '', department: '', email: '' });
  // State to remember which admin to remove
  const [adminToRemove, setAdminToRemove] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const newAdmin = { ...newAdminData, id: `dept_${Date.now()}` };
    setAdmins(prevAdmins => [...prevAdmins, newAdmin]);
    setIsAddModalOpen(false);
    setNewAdminData({ name: '', department: '', email: '' });
  };

  // --- NEW LOGIC FOR REMOVING ADMIN ---
  
  // When the "Remove" button is clicked, store the admin and open the confirmation modal
  const handleRemoveClick = (admin) => {
    setAdminToRemove(admin);
    setIsConfirmModalOpen(true);
  };

  // When the final confirmation is made in the modal
  const handleConfirmRemove = () => {
    // Filter out the admin that matches the one we stored in state
    setAdmins(currentAdmins => currentAdmins.filter(admin => admin.id !== adminToRemove.id));
    
    // Close the modal and reset the state
    setIsConfirmModalOpen(false);
    setAdminToRemove(null);
  };
  
  // --- END OF NEW LOGIC ---

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Department Admins</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Admin</Button>
      </div>

      <Card>
        <div className="space-y-4">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
              <div>
                <p className="font-bold text-gray-800">{admin.name}</p>
                <p className="text-sm text-gray-600">{admin.department}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary">Edit</Button>
                {/* Updated this button to call our new handler */}
                <Button variant="danger" onClick={() => handleRemoveClick(admin)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* --- Add New Admin Modal --- */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Department Admin"
      >
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <Input name="name" placeholder="Full Name" value={newAdminData.name} onChange={handleInputChange} />
          <Input name="department" placeholder="Department Name" value={newAdminData.department} onChange={handleInputChange} />
          <Input type="email" name="email" placeholder="Email Address" value={newAdminData.email} onChange={handleInputChange} />
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Admin</Button>
          </div>
        </form>
      </Modal>

      {/* --- NEW Confirmation Modal for Removing Admin --- */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Removal"
      >
        {adminToRemove && ( // Only render the content if an admin has been selected
          <>
            <p>
              Are you sure you want to remove 
              <strong className="mx-1">{adminToRemove.name}</strong> as an admin for the 
              <strong className="mx-1">{adminToRemove.department}</strong>?
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleConfirmRemove}>Confirm Remove</Button>
            </div>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}