import { useState } from 'react';
import Link from 'next/link';
import api from '../lib/api';

// A self-contained Input component to keep this page independent and robust
const Input = (props) => (
  <input 
    {...props}
    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
    required 
  />
);

// A helper for form fields to reduce repetition
const InputWithLabel = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <Input id={name} name={name} {...props} />
  </div>
);

export default function CollegeRegisterPage() {
  // --- THIS IS THE CRITICAL FIX (Part 1) ---
  // The state is now correctly initialized with all the fields the backend expects.
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 
    setSuccess('');
    try {
      await api.post('/institutions/apply/', formData);
      setSuccess('Application submitted successfully! Our team will review your request and contact you shortly.');
      setFormData({ name: '', address: '', contact_person: '', contact_email: '', contact_phone: '' }); // Clear form
    } catch (err) {
      setError('Submission failed. Please check your details and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Register Your Institution</h2>
            <p className="mt-2 text-gray-600">Join the Punjab Alumni Connect platform.</p>
        </div>
        
        <div className="mt-8">
            {success && <p className="text-green-700 bg-green-100 p-4 rounded-lg text-center mb-6 font-semibold">{success}</p>}
            {error && <p className="text-red-700 bg-red-100 p-4 rounded-lg text-center mb-6 font-semibold">{error}</p>}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* --- THIS IS THE CRITICAL FIX (Part 2) --- */}
                {/* The form now contains all the required input fields. */}
                <InputWithLabel label="Full Institution Name" name="name" placeholder="e.g., Punjab Engineering College" value={formData.name} onChange={handleChange} />
                <InputWithLabel label="Full Postal Address" name="address" placeholder="e.g., Sector 12, Chandigarh" value={formData.address} onChange={handleChange} />
                <hr />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputWithLabel label="Contact Person's Full Name" name="contact_person" placeholder="e.g., Dr. Jane Doe" value={formData.contact_person} onChange={handleChange} />
                    <InputWithLabel label="Official Contact Email" name="contact_email" type="email" placeholder="e.g., registrar@pec.edu" value={formData.contact_email} onChange={handleChange} />
                </div>
                <InputWithLabel label="Official Contact Phone Number" name="contact_phone" value={formData.contact_phone} onChange={handleChange} />
                
                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
             <p className="text-center mt-6 text-sm">
                <Link href="/login" className="text-blue-600 hover:underline">
                    Return to Login
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}