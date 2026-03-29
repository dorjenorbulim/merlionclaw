'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalSessions: 0,
    currentStreak: 0,
    avgMindfulness: 0,
    avgStress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch user stats
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">Please sign in to view your dashboard</p>
        <a href="/sign-in" className="text-indigo-600 hover:underline">Sign In</a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>
      
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 mb-2">Total Sessions</div>
          <div className="text-3xl font-bold text-indigo-600">
            {loading ? '-' : stats.totalSessions}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 mb-2">Current Streak</div>
          <div className="text-3xl font-bold text-green-600">
            {loading ? '-' : `${stats.currentStreak} days`}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 mb-2">Avg Mindfulness</div>
          <div className="text-3xl font-bold text-blue-600">
            {loading ? '-' : `${stats.avgMindfulness}/10`}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 mb-2">Avg Stress</div>
          <div className="text-3xl font-bold text-orange-600">
            {loading ? '-' : `${stats.avgStress}/10`}
          </div>
        </div>
      </div>

      {/* Weekly Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">This Week</h2>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart coming soon: Mindfulness & Stress trends</p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <div className="font-medium">Morning Check-in</div>
              <div className="text-sm text-gray-600">Today, 9:00 AM</div>
            </div>
            <div className="text-right">
              <div className="text-sm">Mood: 7/10</div>
              <div className="text-sm text-gray-600">Stress: 4/10</div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <div className="font-medium">Evening Reflection</div>
              <div className="text-sm text-gray-600">Yesterday, 8:30 PM</div>
            </div>
            <div className="text-right">
              <div className="text-sm">Mood: 6/10</div>
              <div className="text-sm text-gray-600">Stress: 5/10</div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <div className="font-medium">Midday Check-in</div>
              <div className="text-sm text-gray-600">2 days ago, 12:15 PM</div>
            </div>
            <div className="text-right">
              <div className="text-sm">Mood: 8/10</div>
              <div className="text-sm text-gray-600">Stress: 3/10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
