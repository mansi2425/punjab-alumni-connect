import Card from '../ui/Card';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-200 text-yellow-800',
    accepted: 'bg-green-200 text-green-800',
    declined: 'bg-red-200 text-red-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-200'}`}>
      {status}
    </span>
  );
};

export default function OutgoingRequestCard({ request }) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Request sent to:</p>
          <p className="font-bold text-lg">{request.mentor.first_name || request.mentor.username}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <blockquote className="mt-2 p-3 bg-gray-100 rounded-lg italic text-gray-700">
        "{request.initial_message}"
      </blockquote>
      <p className="text-xs text-right text-gray-400 mt-2">
        Sent on: {new Date(request.created_at).toLocaleDateString()}
      </p>
    </Card>
  );
}