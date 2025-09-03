// components/dashboard/JobCard.js
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

// A simple SVG icon component for location and user
const Icon = ({ path }) => (
  <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export default function JobCard({ job, onEdit, onDelete, isAdmin }) {
  // Defensive check in case job data is somehow missing
  const { user } = useAuth();
  if (!job) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 flex items-center justify-center border border-red-200">
        <p className="text-red-600">Job data is missing.</p>
      </div>
    );
  }

  // --- THIS IS THE KEY LOGIC ---
  const isOwner = user && user.id === job.posted_by;
  // --- END OF KEY LOGIC ---

  // A mapping for tag colors to make the UI dynamic
  const tagStyles = {
    Internship: 'bg-blue-100 text-blue-800',
    'Full-Time': 'bg-green-100 text-green-800',
    'Part-Time': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col h-full transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{job.title || 'Untitled Job'}</h3>
          <p className="text-gray-600 font-semibold">{job.company || 'No Company'}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagStyles[job.job_type] || tagStyles['Part-Time']}`}>
          {job.job_type || 'N/A'}
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 my-3 space-y-1 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center">
          <Icon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM10 11a2 2 0 100-4 2 2 0 000 4z" />
          <span>{job.location || 'Not specified'}</span>
        </div>
        <div className="flex items-center">
          <Icon path="M10 20a10 10 0 100-20 10 10 0 000 20zm1-11a1 1 0 10-2 0v4a1 1 0 102 0v-4z" />
          <span>Posted by: {job.posted_by || 'Unknown'}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 flex-grow mb-4">{job.description || 'No description provided.'}</p>
      
      <div className="mt-auto self-end flex items-center space-x-2">
        {/* The management buttons are now conditionally rendered */}
        {isAdmin && (
          <>
            <Button variant="secondary" onClick={onEdit}>Edit</Button>
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          </>
        )}
        <Button>Apply Now</Button>
      </div>
    </div>
  );
}