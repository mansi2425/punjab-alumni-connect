// components/ui/Modal.js
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    // Main modal container with a semi-transparent background
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Modal header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        {/* Modal body */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}