import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function RequestMentorshipModal({ mentorName, isOpen, onClose, onSend }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message); // Pass the message up to the parent component
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Send a Request to ${mentorName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Write a short, personal message explaining why you'd like to connect.
        </p>
        <textarea
          name="initial_message"
          placeholder="e.g., Hello, I'm a student passionate about..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Send Request</Button>
        </div>
      </form>
    </Modal>
  );
}