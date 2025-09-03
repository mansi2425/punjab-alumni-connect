// components/layout/Layout.js
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* The main content area grows to fill available space */}
      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>
      {/* The footer will now correctly appear after the main content */}
      <Footer />
    </div>
  );
}