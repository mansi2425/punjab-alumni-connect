// components/dashboard/EditEventModal.js
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Helper to format the full ISO date string from backend to what the input expects
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // The HTML datetime-local input needs 'YYYY-MM-DDTHH:MM'
  return dateString.slice(0, 16);
};

export default function EditEventModal({ event, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  // This effect runs when the modal is opened, pre-filling the form
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        start_time: formatDateForInput(event.start_time),
        end_time: formatDateForInput(event.end_time),
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} />
        <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} className="w-full ... " rows="4" />
        <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <Input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <Input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}