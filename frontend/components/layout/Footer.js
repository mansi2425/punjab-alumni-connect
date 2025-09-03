// components/layout/Footer.js
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-6 py-4 text-center text-gray-500">
        &copy; {currentYear} Punjab Alumni Connect. All Rights Reserved.
      </div>
    </footer>
  );
}