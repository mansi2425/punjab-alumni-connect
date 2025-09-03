import { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const addNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  const value = { addNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && <Notification message={notification.message} type={notification.type} />}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}

// --- The UI Component for the Toast ---
function Notification({ message, type }) {
  // --- THIS IS THE CRITICAL FIX ---
  // We add 'z-50', which is a higher number than the Navbar's z-10.
  // This ensures the notification always appears on top.
  const baseStyles = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 z-50";
  // --- END OF FIX ---

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      {message}
    </div>
  );
}