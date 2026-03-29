'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function DailyCheckinPage() {
  const { user } = useUser();
  const [mood, setMood] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const startCheckin = async () => {
    if (mood === null || stress === null) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/coaching/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          stress,
          sessionType: 'daily_checkin',
        }),
      });
      
      const data = await response.json();
      setSessionId(data.sessionId);
      setConversation([{ role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error starting check-in:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !sessionId) return;
    
    setLoading(true);
    const userMessage = message;
    setMessage('');
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      const response = await fetch('/api/coaching/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
        }),
      });
      
      const data = await response.json();
      setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">Please sign in to start your daily check-in</p>
        <a href="/sign-in" className="text-indigo-600 hover:underline">Sign In</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">🪷 Daily Mindfulness Check-in</h1>
      
      {!sessionId ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">How are you feeling right now?</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Mood (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={mood || 5}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 - Struggling</span>
                <span>{mood || 5}</span>
                <span>10 - Thriving</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stress Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stress || 5}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 - Calm</span>
                <span>{stress || 5}</span>
                <span>10 - Overwhelmed</span>
              </div>
            </div>
            
            <button
              onClick={startCheckin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Check-in'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Conversation */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4 mb-4">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Input */}
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="What's on your mind today?"
              className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
