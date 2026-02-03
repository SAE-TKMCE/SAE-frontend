import React, { useState } from 'react';
import axios from 'axios';

const CheckStatus = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus(null);

    try {
      const apiBase = process.env.REACT_APP_API_BASE_URL || "https://sae-backend-fux7.onrender.com";
      const response = await axios.get(`${apiBase}/api/membership/status/?email=${encodeURIComponent(email)}`);
      setStatus(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No application found with this email address.');
      } else {
        setError('Failed to check status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (statusValue) => {
    switch (statusValue) {
      case 'approved':
        return 'bg-green-500/20 border-green-500 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 border-red-500 text-red-300';
      default:
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Check Application Status</h2>
        <p className="text-white/70 text-center mb-6">Enter your email to check your Web Team application status</p>
        
        <form onSubmit={handleCheck}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email you used to apply"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-semibold transition duration-300"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}

        {status && (
          <div className={`mt-6 p-6 rounded-lg border ${getStatusStyle(status.status)}`}>
            <p className="text-white font-medium mb-2">Hello, {status.full_name}!</p>
            <p className="text-white/80 text-sm mb-3">Your application status:</p>
            <p className="text-2xl font-bold uppercase">{status.status}</p>
            <p className="text-white/60 text-sm mt-3">
              Applied on: {new Date(status.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {status.status === 'pending' && (
              <p className="text-white/70 text-sm mt-2">Your application is under review. Please check back later.</p>
            )}
            {status.status === 'approved' && (
              <p className="text-green-200 text-sm mt-2">🎉 Congratulations! You'll receive further instructions soon.</p>
            )}
          </div>
        )}

        <p className="mt-6 text-sm text-white/70 text-center">
          Haven't applied yet?{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Apply now
          </a>
        </p>
      </div>
    </div>
  );
};

export default CheckStatus;
