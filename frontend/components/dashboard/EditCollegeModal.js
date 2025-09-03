import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EditCollegeModal({ college, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  // This effect runs when the modal is opened, pre-filling the form with the selected college's data
  useEffect(() => {
    if (college) {
      setFormData({
        name: college.name || '',
        address: college.address || '',
        contact_person: college.contact_person || '',
        contact_email: college.contact_email || '',
        contact_phone: college.contact_phone || '',
      });
    }
  }, [college]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${college?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Full Institution Name" value={formData.name} onChange={handleChange} />
        <Input name="address" placeholder="Full Postal Address" value={formData.address} onChange={handleChange} />
        <hr />
        <Input name="contact_person" placeholder="Contact Person's Full Name" value={formData.contact_person} onChange={handleChange} />
        <Input name="contact_email" type="email" placeholder="Official Contact Email" value={formData.contact_email} onChange={handleChange} />
        <Input name="contact_phone" placeholder="Official Contact Phone Number" value={formData.contact_phone} onChange={handleChange} />
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}