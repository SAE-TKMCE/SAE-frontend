import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth';

// Add custom styles for the grid animation
const styles = `
  @keyframes gridMove {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100px 100px;
    }
  }
`;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getCurrentUser();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getTeamColor = (teamName) => {
    const colors = {
      'VEGHA': 'bg-green-100 text-green-800',
      'HBAJA': 'bg-red-100 text-red-800',
      'MBAJA': 'bg-orange-100 text-orange-800',
      'XLR8 Racing': 'bg-blue-100 text-blue-800',
      'XLR8FST': 'bg-purple-100 text-purple-800',
      'XLR8 E-racing': 'bg-yellow-100 text-yellow-800',
      'SPOX': 'bg-pink-100 text-pink-800',
    };
    return colors[teamName] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s ease-in-out infinite alternate'
            }}
          ></div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 relative z-10"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s ease-in-out infinite alternate'
            }}
          ></div>
        </div>
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 rounded-lg shadow-2xl relative z-10">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s ease-in-out infinite alternate'
            }}
          ></div>
        </div>
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 rounded-lg shadow-2xl relative z-10">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-300">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-900 pt-24 pb-8 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s ease-in-out infinite alternate'
            }}
          ></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold text-white">👤</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'Almarai, sans-serif'}}>
              My Profile
            </h1>
            <p className="text-gray-400 text-lg">Your SAE TKMCE membership information</p>
            <div className="mt-4">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm px-6 py-8 border-b border-gray-700/50">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
                  <span className="text-2xl font-bold text-white">
                    {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">{profile.first_name} {profile.last_name}</h2>
                  <p className="text-blue-100 text-lg font-medium">
                    {profile.membership_type} Member
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      profile.membership_status === 'active' 
                        ? 'bg-green-400/20 text-green-300 border border-green-400/30' 
                        : 'bg-red-400/20 text-red-300 border border-red-400/30'
                    }`}>
                      {profile.membership_status === 'active' ? '✓' : '✗'} {profile.membership_status}
                    </span>
                  </div>
                </div>
            </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                    👤
                  </span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">{profile.username}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">{profile.phone || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">
                        {new Date(profile.date_joined).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                    🎓
                  </span>
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">College</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">{profile.college || 'TKM College of Engineering'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">{profile.branch || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Year of Study</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">{profile.year || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Information */}
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                    👥
                  </span>
                  Team Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Team</label>
                  {profile.preferred_team ? (
                    <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getTeamColor(profile.preferred_team)} backdrop-blur-sm border border-opacity-30`}>
                      {profile.preferred_team}
                    </span>
                  ) : (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-gray-400">Not selected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills & Experience */}
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-yellow-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                    💡
                  </span>
                  Skills & Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Interests</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">{profile.interests || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">{profile.skills || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/30">
                      <span className="text-white">{profile.experience || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Status */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                    🎯
                  </span>
                  Membership Status
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-2">Current Status</p>
                    <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(profile.membership_status)} backdrop-blur-sm border border-opacity-30`}>
                      {profile.membership_status === 'approved' && '✅ Active Member'}
                      {profile.membership_status === 'pending' && '⏳ Pending Admin Approval'}
                      {profile.membership_status === 'rejected' && '❌ Application Rejected'}
                    </span>
                  </div>
                  {profile.membership_status === 'pending' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-300 mb-2">Next Steps</p>
                      <p className="text-sm text-blue-300 font-medium">Wait for admin approval</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-blue-400/30"
                  onClick={() => window.location.href = '/membership'}
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">👥</span>
                    View Membership
                  </span>
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-purple-400/30"
                  onClick={() => window.location.href = '/payments'}
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">💳</span>
                    Payment History
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
