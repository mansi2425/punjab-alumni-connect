import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AcceptRequestModal({ request, isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    shared_contact_info: '',
    shared_message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the collected data up to the parent component's confirm function
    onConfirm(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Accept Request from ${request?.requester?.first_name || request?.requester?.username}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="shared_contact_info" className="block text-sm font-medium text-gray-700">
            Contact Info to Share
          </label>
          <p className="text-xs text-gray-500 mb-1">Provide the best way for them to reach you (e.g., email, phone, Google Meet link).</p>
          <Input 
            id="shared_contact_info"
            name="shared_contact_info" 
            placeholder="e.g., my.email@example.com" 
            value={formData.shared_contact_info} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label htmlFor="shared_message" className="block text-sm font-medium text-gray-700">
            Welcome Message (Optional)
          </label>
          <textarea
            id="shared_message"
            name="shared_message"
            placeholder="e.g., 'Looking forward to connecting! Feel free to email me to set up a time.'"
            value={formData.shared_message}
            onChange={handleChange}
            className="w-full h-24 mt-1 px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Confirm & Accept</Button>
        </div>
      </form>
    </Modal>
  );
}