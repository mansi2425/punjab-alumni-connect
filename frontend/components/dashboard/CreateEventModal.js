// components/dashboard/CreateEventModal.js
import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function CreateEventModal({ isOpen, onClose, onSave }) {
  // State to hold the form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Pass the form data to the parent's save function
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Event Description..."
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
        <Input name="location" placeholder="Location (e.g., 'Virtual' or 'Auditorium')" value={formData.location} onChange={handleChange} />
        
        {/* HTML5 datetime-local input is the easiest way to get a user-friendly date and time */}
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
          <Button type="submit" variant="primary">Create Event</Button>
        </div>
      </form>
    </Modal>
  );
}