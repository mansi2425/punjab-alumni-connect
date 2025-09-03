// components/dashboard/EditJobModal.js
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EditJobModal({ job, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  // This effect runs when the modal is opened, pre-filling the form with the selected job's data
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        description: job.description || '',
        job_type: job.job_type || 'Internship',
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Opening">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} />
        <Input name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} />
        <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50">
          <option value="Internship">Internship</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
        </select>
        <textarea name="description" placeholder="Job Description..." value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" rows="4" />
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}