// components/ui/Card.js

export default function Card({ children, title, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
          {title}
        </h3>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
}