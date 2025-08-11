import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/supabaseMock';

const Dashboard = () => {
  const [stats, setStats] = useState({
    members: { total: 0, pending: 0, approved: 0, recent: [] },
    events: { total: 0, upcoming: 0, published: 0, recent: [] },
    registrations: { total: 0, today: 0, thisWeek: 0 },
    forms: { templates: 0, fields: 0 },
    media: { total: 0, size: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CSS Animation Styles
  const styles = `
    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(25px, 25px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        members,
        events,
        registrations,
        formTemplates,
        formFields,
        mediaAssets,
        activity
      ] = await Promise.all([
        adminService.getAllMembers(),
        adminService.getAllEvents(),
        adminService.getAllEventRegistrations(),
        adminService.getFormTemplates(),
        adminService.getFormFields(),
        adminService.getMediaAssets(),
        adminService.getRecentActivity()
      ]);

      // Calculate member stats
      const memberStats = {
        total: members.length,
        pending: members.filter(m => m.status === 'pending').length,
        approved: members.filter(m => m.status === 'approved').length,
        recent: members
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
      };

      // Calculate event stats
      const now = new Date();
      const eventStats = {
        total: events.length,
        upcoming: events.filter(e => new Date(e.event_date) > now && e.status === 'published').length,
        published: events.filter(e => e.status === 'published').length,
        recent: events
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
      };

      // Calculate registration stats
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const registrationStats = {
        total: registrations.length,
        today: registrations.filter(r => {
          const regDate = new Date(r.created_at);
          return regDate.toDateString() === today.toDateString();
        }).length,
        thisWeek: registrations.filter(r => new Date(r.created_at) >= weekAgo).length
      };

      // Calculate form and media stats
      const formStats = {
        templates: formTemplates.length,
        fields: formFields.length
      };

      const mediaStats = {
        total: mediaAssets.length,
        size: mediaAssets.reduce((sum, asset) => sum + (asset.file_size || 0), 0)
      };

      setStats({
        members: memberStats,
        events: eventStats,
        registrations: registrationStats,
        forms: formStats,
        media: mediaStats
      });

      setRecentActivity(activity || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getActivityIcon = (action) => {
    const icons = {
      member_registered: '👤',
      member_approved: '✅',
      event_created: '📅',
      event_published: '📢',
      registration_received: '📝',
      form_updated: '📋',
      media_uploaded: '📎'
    };
    return icons[action] || '📊';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-10">
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

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse">
              <span className="text-2xl">📊</span>
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mb-4"></div>
            <p className="text-gray-300 font-medium">Loading Dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-10">
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

          <div className="relative z-10 p-6">
            <div className="bg-red-900/50 backdrop-blur-xl border border-red-500/50 rounded-xl p-6 max-w-lg mx-auto">
              <div className="flex items-center mb-4">
                <span className="text-red-400 mr-3 text-2xl">⚠️</span>
                <div>
                  <h3 className="text-lg font-medium text-red-300">Error Loading Dashboard</h3>
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchDashboardData}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-red-400/30"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-5">
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

        <div className="relative z-10 space-y-6 p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold text-white">📊</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'Almarai, sans-serif'}}>
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Welcome to SAE TKMCE Admin Panel</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total Members</p>
                  <p className="text-3xl font-bold text-white">{stats.members.total}</p>
                  <p className="text-xs text-blue-400">
                    {stats.members.pending} pending approval
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Events</p>
                  <p className="text-3xl font-bold text-white">{stats.events.total}</p>
                  <p className="text-xs text-green-400">
                    {stats.events.upcoming} upcoming
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Registrations</p>
                  <p className="text-3xl font-bold text-white">{stats.registrations.total}</p>
                  <p className="text-xs text-purple-400">
                    {stats.registrations.today} today
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Media Files</p>
                  <p className="text-3xl font-bold text-white">{stats.media.total}</p>
                  <p className="text-xs text-orange-400">
                    {formatFileSize(stats.media.size)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🚀</span>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <a
                href="/admin/members"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-blue-500/50 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm font-medium text-white">Members</div>
                <div className="text-xs text-gray-400">Manage applications</div>
              </a>
              <a
                href="/admin/events"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-green-500/50 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="text-sm font-medium text-white">Events</div>
                <div className="text-xs text-gray-400">Create & manage</div>
              </a>
              <a
                href="/admin/forms"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-purple-500/50 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">📋</div>
                <div className="text-sm font-medium text-white">Forms</div>
                <div className="text-xs text-gray-400">Build & customize</div>
              </a>
              <a
                href="/admin/media"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-orange-500/50 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm font-medium text-white">Media</div>
                <div className="text-xs text-gray-400">Upload & organize</div>
              </a>
              <a
                href="/admin/settings"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-yellow-500/50 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm font-medium text-white">Settings</div>
                <div className="text-xs text-gray-400">Configure system</div>
              </a>
              <a
                href="/admin/reports"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 hover:border-red-500/50 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-white">Reports</div>
                <div className="text-xs text-gray-400">Analytics & export</div>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Members */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-3">👥</span>
                    Recent Members
                  </h3>
                  <a href="/admin/members" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    View all →
                  </a>
                </div>
              </div>
              <div className="p-6">
                {stats.members.recent.length > 0 ? (
                  <div className="space-y-4">
                    {stats.members.recent.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-sm text-white font-medium">
                              {member.first_name?.charAt(0)}{member.last_name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-gray-400 truncate">{member.email}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${
                            member.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                            member.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                            'bg-red-500/20 text-red-300 border-red-400/30'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">👥</span>
                    <p className="text-sm text-gray-400">No recent members</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-3">📅</span>
                    Recent Events
                  </h3>
                  <a href="/admin/events" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    View all →
                  </a>
                </div>
              </div>
              <div className="p-6">
                {stats.events.recent.length > 0 ? (
                  <div className="space-y-4">
                    {stats.events.recent.map((event) => (
                      <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-600/30 hover:border-green-500/50 transition-all duration-300">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <span className="text-sm text-white">📅</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(event.event_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${
                            event.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                            event.status === 'draft' ? 'bg-gray-500/20 text-gray-300 border-gray-400/30' :
                            'bg-red-500/20 text-red-300 border-red-400/30'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📅</span>
                    <p className="text-sm text-gray-400">No recent events</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="mr-3">📊</span>
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.slice(0, 10).map((activity, index) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {index !== recentActivity.slice(0, 10).length - 1 && (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-600"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-gray-800 border border-blue-400/30">
                                <span className="text-sm">{getActivityIcon(activity.action)}</span>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-300">
                                  {activity.description || `${activity.action.replace('_', ' ')}`}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-400">
                                <time>{getTimeAgo(activity.created_at)}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📊</span>
                  <p className="text-sm text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-400/30 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🟢</span>
              System Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-600/30">
                <div className="text-3xl mb-3">🟢</div>
                <div className="text-sm font-medium text-white">Database</div>
                <div className="text-xs text-green-400">Connected</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-600/30">
                <div className="text-3xl mb-3">🟢</div>
                <div className="text-sm font-medium text-white">ImageKit</div>
                <div className="text-xs text-green-400">Active</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-600/30">
                <div className="text-3xl mb-3">🟢</div>
                <div className="text-sm font-medium text-white">Forms</div>
                <div className="text-xs text-blue-400">{stats.forms.templates} templates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
