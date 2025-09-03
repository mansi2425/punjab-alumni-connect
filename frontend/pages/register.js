import { useState } from 'react';
import Link from 'next/link';
import api from '../lib/api';

// A self-contained Input component to keep this page independent and robust
const Input = (props) => (
  <input 
    {...props}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
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

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    profile: {
      college: '',
      department: '',
      graduation_year: '',
      enrollment_number: '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.profile) {
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/users/register/', formData);
      setSuccess('Registration successful! Your application is now pending admin approval.');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessages = Object.values(errorData).flat().join(' ');
        setError(errorMessages || 'Registration failed. Please try again.');
      } else {
        setError('An unknown error occurred. Please try again.');
      }
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
        
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-4">{error}</p>}
        {success && <p className="text-green-700 bg-green-100 p-3 rounded-lg text-center mb-4">{success}</p>}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithLabel label="Username" name="username" value={formData.username} onChange={handleChange} />
              <InputWithLabel label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <InputWithLabel label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a...</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-white mt-1">
                <option value="student">Current Student</option>
                <option value="alumni">Alumnus</option>
              </select>
            </div>
            
            <hr className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithLabel label="College Name" name="college" value={formData.profile.college} onChange={handleChange} placeholder="e.g., Punjab Engineering College" />
              <InputWithLabel label="Department" name="department" value={formData.profile.department} onChange={handleChange} placeholder="e.g., Computer Science" />
              
              {formData.role === 'student' ? (
                <>
                  <InputWithLabel label="Expected Passing Year" name="graduation_year" type="number" value={formData.profile.graduation_year} onChange={handleChange} placeholder="e.g., 2027" />
                  <InputWithLabel label="Roll Number" name="enrollment_number" value={formData.profile.enrollment_number} onChange={handleChange} />
                </>
              ) : (
                <>
                  <InputWithLabel label="Year You Passed Out" name="graduation_year" type="number" value={formData.profile.graduation_year} onChange={handleChange} placeholder="e.g., 2020" />
                  <InputWithLabel label="Enrollment Number" name="enrollment_number" value={formData.profile.enrollment_number} onChange={handleChange} />
                </>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 mt-6 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}