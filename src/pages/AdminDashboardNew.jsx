import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContextMock';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newEntry, setNewEntry] = useState({});

  useEffect(() => {
    if (user && user.is_staff) {
      fetchUsers();
      fetchEventRegistrations();
      fetchEvents();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventRegistrations = async () => {
    try {
      const response = await api.get('/admin/event-registrations/');
      setEventRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching event registrations:', error);
      setError('Failed to fetch event registrations');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleUserApproval = async (userId, action) => {
    try {
      await api.patch(`/admin/users/${userId}/`, { 
        is_approved: action === 'approve',
        membership_status: action === 'approve' ? 'approved' : 'rejected'
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user approval:', error);
    }
  };

  const handleEventRegistrationApproval = async (registrationId, action) => {
    try {
      await api.patch(`/admin/event-registrations/${registrationId}/`, { 
        status: action === 'approve' ? 'approved' : 'rejected'
      });
      fetchEventRegistrations(); // Refresh the list
    } catch (error) {
      console.error('Error updating event registration approval:', error);
    }
  };

  const handleAddEntry = async (type) => {
    try {
      if (type === 'event') {
        await api.post('/admin/event-registrations/', newEntry);
        fetchEventRegistrations();
      } else if (type === 'membership') {
        await api.post('/admin/users/', newEntry);
        fetchUsers();
      }
      setShowModal(false);
      setNewEntry({});
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

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
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'confirmed': 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Filter users by status
  const pendingUsers = users.filter(user => user.membership_status === 'pending');
  const approvedUsers = users.filter(user => user.membership_status === 'approved');
  const rejectedUsers = users.filter(user => user.membership_status === 'rejected');

  // Filter event registrations by status
  const pendingEventRegistrations = eventRegistrations.filter(reg => reg.status === 'pending');
  const approvedEventRegistrations = eventRegistrations.filter(reg => reg.status === 'approved');
  const rejectedEventRegistrations = eventRegistrations.filter(reg => reg.status === 'rejected');

  if (!user || !user.is_staff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Memberships</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingUsers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Registrations</h3>
          <p className="text-3xl font-bold text-green-600">{eventRegistrations.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Events</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingEventRegistrations.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('membership-pending')}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <div className="text-lg font-semibold text-yellow-800">Review Memberships</div>
            <div className="text-sm text-yellow-600">{pendingUsers.length} pending approvals</div>
          </button>
          <button
            onClick={() => setActiveTab('events-pending')}
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <div className="text-lg font-semibold text-orange-800">Review Events</div>
            <div className="text-sm text-orange-600">{pendingEventRegistrations.length} pending approvals</div>
          </button>
          <button
            onClick={() => { setModalType('membership'); setShowModal(true); }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="text-lg font-semibold text-blue-800">Add Member</div>
            <div className="text-sm text-blue-600">Manually add new member</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserSection = (usersList, title, statusType) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusType)}`}>
          {usersList.length} {statusType}
        </span>
      </div>
      
      {usersList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No {statusType} users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersList.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{user.college_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTeamColor(user.preferred_team)}`}>
                      {user.preferred_team || 'No Team'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.membership_status)}`}>
                      {user.membership_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.membership_status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUserApproval(user.id, 'approve')}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUserApproval(user.id, 'reject')}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {user.membership_status === 'rejected' && (
                      <button
                        onClick={() => handleUserApproval(user.id, 'approve')}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderEventSection = (eventsList, title, statusType) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusType)}`}>
          {eventsList.length} {statusType}
        </span>
      </div>
      
      {eventsList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No {statusType} event registrations found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventsList.map((registration) => (
                <tr key={registration.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {registration.user?.first_name} {registration.user?.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{registration.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{registration.event?.title}</div>
                    <div className="text-sm text-gray-500">{registration.event_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(registration.registration_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registration.status)}`}>
                      {registration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {registration.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEventRegistrationApproval(registration.id, 'approve')}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleEventRegistrationApproval(registration.id, 'reject')}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {registration.status === 'rejected' && (
                      <button
                        onClick={() => handleEventRegistrationApproval(registration.id, 'approve')}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAddEntryModal = () => (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Add New {modalType}</h2>
          <div className="space-y-4">
            {modalType === 'membership' && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.first_name || ''}
                  onChange={(e) => setNewEntry({...newEntry, first_name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.last_name || ''}
                  onChange={(e) => setNewEntry({...newEntry, last_name: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.email || ''}
                  onChange={(e) => setNewEntry({...newEntry, email: e.target.value})}
                />
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.preferred_team || ''}
                  onChange={(e) => setNewEntry({...newEntry, preferred_team: e.target.value})}
                >
                  <option value="">Select Team</option>
                  <option value="VEGHA">VEGHA</option>
                  <option value="HBAJA">HBAJA</option>
                  <option value="MBAJA">MBAJA</option>
                  <option value="XLR8 Racing">XLR8 Racing</option>
                  <option value="XLR8FST">XLR8FST</option>
                  <option value="XLR8 E-racing">XLR8 E-racing</option>
                  <option value="SPOX">SPOX</option>
                </select>
              </>
            )}
            {modalType === 'event' && (
              <>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.user_id || ''}
                  onChange={(e) => setNewEntry({...newEntry, user_id: e.target.value})}
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} - {user.email}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.event_id || ''}
                  onChange={(e) => setNewEntry({...newEntry, event_id: e.target.value})}
                >
                  <option value="">Select Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddEntry(modalType)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add {modalType}
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'membership-pending', label: 'Pending Memberships' },
            { id: 'membership-approved', label: 'Approved Memberships' },
            { id: 'membership-rejected', label: 'Rejected Memberships' },
            { id: 'events-pending', label: 'Pending Events' },
            { id: 'events-approved', label: 'Approved Events' },
            { id: 'events-rejected', label: 'Rejected Events' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add Entry Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => { setModalType('membership'); setShowModal(true); }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Membership
          </button>
          <button
            onClick={() => { setModalType('event'); setShowModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Event Registration
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'membership-pending' && renderUserSection(pendingUsers, 'Pending Memberships', 'pending')}
        {activeTab === 'membership-approved' && renderUserSection(approvedUsers, 'Approved Memberships', 'approved')}
        {activeTab === 'membership-rejected' && renderUserSection(rejectedUsers, 'Rejected Memberships', 'rejected')}
        {activeTab === 'events-pending' && renderEventSection(pendingEventRegistrations, 'Pending Event Registrations', 'pending')}
        {activeTab === 'events-approved' && renderEventSection(approvedEventRegistrations, 'Approved Event Registrations', 'approved')}
        {activeTab === 'events-rejected' && renderEventSection(rejectedEventRegistrations, 'Rejected Event Registrations', 'rejected')}
        
        {/* Add Entry Modal */}
        {renderAddEntryModal()}
      </div>
    </div>
  );
};

export default AdminDashboard;
