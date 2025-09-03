// pages/dashboard/events.js
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import EventCard from '../../components/dashboard/EventCard';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import api from '../../lib/api';
import CreateEventModal from '../../components/dashboard/CreateEventModal';
import EditEventModal from '../../components/dashboard/EditEventModal';
import { useAuth } from '../../context/AuthContext';

export default function EventsPage() {
  const { user } = useAuth(); // Get the currently logged-in user
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/events/');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch events after the user object has been loaded
    if (user) {
      fetchEvents();
    }
  }, [user]); // This dependency ensures the effect re-runs when the user is available

  const handleSaveEvent = async (eventData) => {
    try {
      await api.post('/events/', eventData);
      setIsCreateModalOpen(false);
      await fetchEvents();
    } catch (err) {
      setError('Failed to create event. Please check the details and try again.');
      console.error(err);
    }
  };

  const handleOpenEditModal = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await api.patch(`/events/${selectedEvent.id}/`, eventData);
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      await fetchEvents();
    } catch (err) {
      setError('Failed to update event. Please try again.');
      console.error(err);
    }
  };
  
  const handleOpenDeleteModal = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await api.delete(`/events/${eventToDelete.id}/`);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      await fetchEvents();
    } catch (err) {
      setError('Failed to delete event. Please try again.');
      console.error(err);
    }
  };

  const renderContent = () => {
    // Show spinner if we're fetching events OR if the user object isn't loaded yet
    if (loading || !user) return <Spinner />;
    
    if (error && events.length === 0) return <p className="text-red-500 text-center">{error}</p>;
    if (events.length === 0) return <p className="text-gray-500 text-center">No upcoming events.</p>;
    
    return (
      <div className="space-y-6">
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            user={user} // Pass the complete user object down as a prop
            onEdit={() => handleOpenEditModal(event)}
            onDelete={() => handleOpenDeleteModal(event)}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Upcoming Events</h1>
          <p className="text-gray-600">Discover workshops, meetups, and networking opportunities.</p>
        </div>
        {/* Button is now role-aware */}
        {user && user.role !== 'student' && (
          <Button onClick={() => setIsCreateModalOpen(true)}>+ Add New Event</Button>
        )}
      </div>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      
      {renderContent()}

      <CreateEventModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveEvent} />
      <EditEventModal event={selectedEvent} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateEvent} />
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to permanently delete the event: 
          <strong className="mx-1">{eventToDelete?.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteEvent}>Confirm Delete</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}