import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Modal from '../../../components/ui/Modal';
import api from '../../../lib/api';
import { useNotification } from '../../../context/NotificationContext';
import EditCollegeModal from '../../../components/dashboard/EditCollegeModal'; // <-- Import the new modal

export default function ManageCollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  // State for the Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [collegeToEdit, setCollegeToEdit] = useState(null);
  
  // State for the Delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState(null);

  const fetchColleges = async () => {
    try {
      const response = await api.get('/institutions/approved/');
      setColleges(response.data);
    } catch (error) {
      addNotification('Failed to load colleges.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleOpenEditModal = (college) => {
    setCollegeToEdit(college);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    if (!collegeToEdit) return;
    try {
      await api.patch(`/institutions/${collegeToEdit.id}/`, formData);
      addNotification('Institution updated successfully.', 'success');
      setIsEditModalOpen(false);
      fetchColleges(); // Refresh the list
    } catch (error) {
      addNotification('Failed to update institution.', 'error');
    }
  };

  const handleOpenDeleteModal = (college) => {
    setCollegeToDelete(college);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!collegeToDelete) return;
    try {
      await api.delete(`/institutions/${collegeToDelete.id}/`);
      addNotification('Institution deleted successfully.', 'success');
      setIsDeleteModalOpen(false);
      fetchColleges(); // Refresh the list
    } catch (error) {
      addNotification('Failed to delete institution.', 'error');
    }
  };

  if (loading) {
    return <DashboardLayout><Spinner /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Approved Institutions</h1>
      <Card>
        {colleges.length > 0 ? (
          <div className="space-y-4">
            {colleges.map((college) => (
              <div key={college.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-md border">
                <div className="mb-2 sm:mb-0">
                  <p className="font-bold">{college.name}</p>
                  <p className="text-sm text-gray-500">{college.contact_person} - {college.contact_email}</p>
                </div>
                <div className="flex space-x-2 self-end sm:self-center">
                  <Button variant="secondary" onClick={() => handleOpenEditModal(college)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleOpenDeleteModal(college)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No approved institutions found.</p>
        )}
      </Card>

      <EditCollegeModal 
        college={collegeToEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
      />

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <p>Are you sure you want to delete <strong className="mx-1">{collegeToDelete?.name}</strong>? This action is permanent and cannot be undone.</p>
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Confirm Delete</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

