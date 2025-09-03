// components/ui/Input.js
export default function Input({ type = 'text', placeholder, value, onChange, name }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
      required
    />
  );
}