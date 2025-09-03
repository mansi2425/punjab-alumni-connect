import Card from '../ui/Card';
import Button from '../ui/Button';

export default function IncomingRequestCard({ request, onAccept, onDecline }) {
  if (!request || !request.requester) {
    return <Card>Invalid request data.</Card>;
  }

  // Extract the profile for easier access
  const requesterProfile = request.requester.profile;

  return (
    <Card>
      <div className="flex flex-col sm:flex-row">
        <div className="flex-grow">
          <p className="font-bold text-lg">{request.requester.first_name || request.requester.username}</p>
          
          {/* --- THIS IS THE NEW, INFORMATIVE SECTION --- */}
          <div className="text-sm text-gray-600 mt-1 space-y-1">
            <p><strong>Department:</strong> {requesterProfile?.department || 'N/A'}</p>
            <p><strong>Graduation Year:</strong> {requesterProfile?.graduation_year || 'N/A'}</p>
            <p><strong>Skills:</strong> {requesterProfile?.skills || 'No skills listed.'}</p>
          </div>
          {/* --- END OF NEW SECTION --- */}

          <blockquote className="mt-3 p-3 bg-gray-100 rounded-lg italic text-gray-700">
            "{request.initial_message}"
          </blockquote>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex sm:flex-col items-stretch space-y-2">
          <Button variant="primary" onClick={onAccept}>Accept</Button>
          <Button variant="danger" onClick={onDecline}>Decline</Button>
        </div>
      </div>
    </Card>
  );
}