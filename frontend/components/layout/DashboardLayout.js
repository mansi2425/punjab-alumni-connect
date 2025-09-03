// components/layout/DashboardLayout.js
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ChatbotWidget from '../chatbot/ChatbotWidget';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6 bg-gray-100">
          {children}
        </main>
      </div>
      {/* The Footer and Chatbot were missing. They are now included. */}
      <Footer />
      <ChatbotWidget />
    </div>
  );
}