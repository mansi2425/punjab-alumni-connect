// components/dashboard/EventCard.js
import Button from '../ui/Button';

const Icon = ({ path }) => (
  <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return { day: '??', month: '???', year: '????', time: 'No time set' };
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { day: '??', month: '???', year: '????', time: 'Invalid time' };

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { day, month, year, time };
};

export default function EventCard({ event, user, onEdit, onDelete }) {
  if (!event) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-red-200">
        <p className="text-red-600">Error: Event data is missing or corrupted.</p>
      </div>
    );
  }

  const formattedDate = formatDate(event.start_time);
  
  // The permission check now uses the reliable 'user' prop
  const isOwner = user && Number(user.id) === Number(event.organizer);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-xl">
      <div className="bg-blue-100 text-blue-800 p-4 text-center md:w-32 flex-shrink-0">
        <p className="text-2xl font-bold">{formattedDate.day}</p>
        <p className="text-md uppercase font-semibold">{formattedDate.month}</p>
        <p className="text-sm text-blue-600">{formattedDate.year}</p>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-800">{event.title || 'Untitled Event'}</h3>
        <div className="flex flex-wrap items-center text-sm text-gray-600 my-2">
          <div className="flex items-center mr-4 mb-1 md:mb-0">
            <Icon path="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            <span>{formattedDate.time}</span>
          </div>
          <div className="flex items-center">
            <Icon path="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            <span>{event.location || 'No location set'}</span>
          </div>
        </div>
        <p className="text-sm text-gray-700 flex-grow">{event.description || 'No description provided.'}</p>
        <div className="mt-4 self-end flex items-center space-x-2">
          {isOwner && (
            <>
              <Button variant="secondary" onClick={onEdit}>Edit</Button>
              <Button variant="danger" onClick={onDelete}>Delete</Button>
            </>
          )}
          <Button>RSVP Now</Button>
        </div>
      </div>
    </div>
  );
}