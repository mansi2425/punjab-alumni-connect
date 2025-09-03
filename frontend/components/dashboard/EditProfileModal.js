// components/dashboard/EditProfileModal.js
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EditProfileModal({ user, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    profile: {
      headline: '',
      company: '',
      location: '',
      about: '',
      skills: '',
    }
  });

  // This effect pre-fills the form whenever the user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        profile: {
          headline: user.profile?.headline || '',
          company: user.profile?.company || '',
          location: user.profile?.location || '',
          about: user.profile?.about || '',
          skills: user.profile?.skills || '',
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested profile fields
    if (name in formData.profile) {
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Modal Checkpoint: Form submitted. Passing this data up:", formData);
    onSave(formData); // Pass the updated data to the parent component's save function
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
        <Input name="headline" placeholder="Your Headline" value={formData.profile.headline} onChange={handleChange} />
        <Input name="company" placeholder="Current Company" value={formData.profile.company} onChange={handleChange} />
        <Input name="location" placeholder="Your Location" value={formData.profile.location} onChange={handleChange} />
        <Input 
          name="skills" 
          placeholder="Your Skills (comma-separated, e.g., React, Python)" 
          value={formData.profile.skills} 
          onChange={handleChange} 
        />
        <textarea
          name="about"
          placeholder="Tell us about yourself..."
          value={formData.profile.about}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
          rows="4"
        ></textarea>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}