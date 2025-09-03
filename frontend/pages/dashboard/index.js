// pages/dashboard/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const MentorCard = ({ mentor }) => (
    <Link href={`/alumni/${mentor.id}`}>
        <div className="text-center p-4 border rounded-lg hover:shadow-md cursor-pointer h-full">
            <img src={`https://i.pravatar.cc/150?u=${mentor.username}`} alt={mentor.first_name} className="w-20 h-20 rounded-full mx-auto mb-3" />
            <h4 className="font-bold text-gray-800">{mentor.first_name || mentor.username}</h4>
            <p className="text-sm text-gray-600">{mentor.profile?.headline}</p>
        </div>
    </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/users/mentors/recommend/');
        setRecommendations(response.data);
      } catch (err) {
        console.error("Could not fetch recommendations:", err);
      } finally {
        setLoadingRecs(false);
      }
    };
    if (user) { // Only fetch if the user is loaded
        fetchRecommendations();
    }
  }, [user]);

  const userName = user ? (user.first_name || user.username) : 'User';

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {userName}!</h1>
        <p className="text-gray-600">Here's a snapshot of your community.</p>
      </div>
      
      {/* --- AI RECOMMENDATION CARD --- */}
      <Card title="Recommended Mentors For You">
        {loadingRecs ? <Spinner /> : (
            recommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map(rec => <MentorCard key={rec.mentor.id} mentor={rec.mentor} />)}
                </div>
            ) : (
                <p className="text-gray-500">No mentor recommendations right now. Add skills to your profile to get started!</p>
            )
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card><h4 className="... ">Total Alumni</h4><p className="...">10,482</p></Card>
        <Card><h4 className="... ">Job Openings</h4><p className="...">73</p></Card>
        <Card><h4 className="... ">Upcoming Events</h4><p className="...">4</p></Card>
      </div>
    </DashboardLayout>
  );
}