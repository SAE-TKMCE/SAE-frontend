import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { adminService } from '../../services/supabaseMock';
import MemberManagement from './MemberManagement';
import MembershipManagement from './MembershipManagement';
import ExecomManagement from './ExecomManagement';
import EventManagement from './EventManagement';
import FormBuilder from './FormBuilderSimple';
import MediaManager from './MediaManager';
import Settings from './Settings';
import Dashboard from './Dashboard';
import CreateEvent from './CreateEvent';

// Mock auth service for development
const authService = {
  getCurrentUser: () => adminService.getCurrentUser(),
  isAdmin: () => Promise.resolve(true),
  signOut: () => adminService.logout()
};

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // CSS Animation Styles
  const styles = `
    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(25px, 25px); }
    }
  `;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const adminStatus = await authService.isAdmin(currentUser.id);
        setIsAdmin(adminStatus);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
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

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mb-4"></div>
            <p className="text-gray-300 font-medium">Loading Admin Panel...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊', current: location.pathname === '/admin' },
    { name: 'Members', href: '/admin/members', icon: '👥', current: location.pathname.startsWith('/admin/members') },
    { name: 'Memberships', href: '/admin/memberships', icon: '🎫', current: location.pathname.startsWith('/admin/memberships') },
    { name: 'Executive Committee', href: '/admin/execom', icon: '👑', current: location.pathname.startsWith('/admin/execom') },
    { name: 'Events', href: '/admin/events', icon: '🎉', current: location.pathname.startsWith('/admin/events') },
    { name: 'Forms', href: '/admin/forms', icon: '📝', current: location.pathname.startsWith('/admin/forms') },
    { name: 'Media', href: '/admin/media', icon: '🖼️', current: location.pathname.startsWith('/admin/media') },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️', current: location.pathname.startsWith('/admin/settings') },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-900 flex">
        {/* Animated Grid Background */}
        <div className="fixed inset-0 opacity-10">
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

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/95 backdrop-blur-xl shadow-2xl transform lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out border-r border-gray-700/50`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">⚡</span>
            </div>
            <span className="text-xl font-bold text-white">SAE Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200"
          >
            <span className="sr-only">Close sidebar</span>
            ✕
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.current
                    ? 'bg-blue-600/20 text-blue-300 border-blue-400/50'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border backdrop-blur-sm`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* User menu */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700/50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white truncate">
                {user.email}
              </p>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-0">
        {/* Top bar */}
        <div className="bg-gray-800/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700/50"
            >
              <span className="sr-only">Open sidebar</span>
              ☰
            </button>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-white">
                {navigation.find(item => item.current)?.name || 'Admin Panel'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700/50">
                <span className="sr-only">View notifications</span>
                🔔
              </button>

              {/* Quick actions */}
              <div className="relative">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-blue-400/30 shadow-xl">
                  Quick Action
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="members/*" element={<MemberManagement />} />
                <Route path="memberships/*" element={<MembershipManagement />} />
                <Route path="execom/*" element={<ExecomManagement />} />
                <Route path="events" element={<EventManagement />} />
                <Route path="events/create" element={<CreateEvent />} />
                <Route path="forms/*" element={<FormBuilder />} />
                <Route path="media/*" element={<MediaManager />} />
                <Route path="settings/*" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
    </>
  );
};

export default AdminPanel;
