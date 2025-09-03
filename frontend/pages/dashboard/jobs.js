// pages/dashboard/jobs.js
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import JobCard from '../../components/dashboard/JobCard';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal'; // <-- Import Modal for confirmation
import api from '../../lib/api';
import CreateJobModal from '../../components/dashboard/CreateJobModal';
import EditJobModal from '../../components/dashboard/EditJobModal';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // --- NEW STATE FOR DELETE CONFIRMATION ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/jobs/');
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load job postings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveJob = async (jobData) => {
    try {
      await api.post('/jobs/', jobData);
      setIsCreateModalOpen(false);
      await fetchJobs(); // Refresh the list
    } catch (err) {
      setError('Failed to post job. Please try again.');
      console.error(err);
    }
  };

  // --- NEW FUNCTIONS FOR DELETING ---
  const handleOpenDeleteModal = (job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      // Send a DELETE request to our detail endpoint
      await api.delete(`/jobs/${jobToDelete.id}/`);
      
      // Refresh the list to show the job has been removed
      await fetchJobs();
      
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (err) {
      setError('Failed to delete job. Please try again.');
      console.error(err);
    }
  };

  // --- NEW FUNCTIONS FOR EDITING ---
  const handleOpenEditModal = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleUpdateJob = async (jobData) => {
    try {
      // Send a PATCH request to our job detail endpoint
      await api.patch(`/jobs/${selectedJob.id}/`, jobData);
      
      setIsEditModalOpen(false);
      setSelectedJob(null);
      await fetchJobs(); // Refresh the list to show the updated data
    } catch (err) {
      setError('Failed to update job. Please try again.');
      console.error(err);
    }
  };

  const isAdminOrAlumni = true; // This would be based on the logged-in user's role

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (error && jobs.length === 0) return <p className="text-red-500 text-center">{error}</p>;
    if (jobs.length === 0) return <p className="text-gray-500 text-center">No jobs posted.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            onEdit={() => handleOpenEditModal(job)}
            // Pass the delete handler down to the card
            onDelete={() => handleOpenDeleteModal(job)}
          />
        ))}
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold ...">Jobs & Internships</h1>
          <p className="text-gray-600 ...">Opportunities posted by our trusted alumni network.</p>
        </div>
        {isAdminOrAlumni && (
          <Button onClick={() => setIsCreateModalOpen(true)}>+ Post New Job</Button>
        )}
      </div>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      
      {renderContent()}

      <CreateJobModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveJob} />
      <EditJobModal job={selectedJob} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateJob} />
      
      {/* --- RENDER THE DELETE CONFIRMATION MODAL --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to permanently delete the job posting for
          <strong className="mx-1">{jobToDelete?.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteJob}>Confirm Delete</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}