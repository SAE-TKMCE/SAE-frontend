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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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
      const response = await api.get('/admin/events/');
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
      } else if (type === 'new-event') {
        await api.post('/admin/events/', newEntry);
        fetchEvents();
      }
      setShowModal(false);
      setNewEntry({});
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await api.delete(`/admin/events/${eventId}/`);
      fetchEvents();
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleToggleEventStatus = async (eventId) => {
    try {
      await api.post(`/admin/events/${eventId}/toggle-status/`);
      fetchEvents();
    } catch (error) {
      console.error('Error toggling event status:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Memberships</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingUsers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-purple-600">{events.length}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            onClick={() => setActiveTab('event-management')}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="text-lg font-semibold text-purple-800">Manage Events</div>
            <div className="text-sm text-purple-600">{events.length} total events</div>
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
        <div className={`bg-white rounded-lg p-6 w-full ${modalType === 'new-event' ? 'max-w-2xl' : 'max-w-md'}`}>
          <h2 className="text-xl font-semibold mb-4">
            {modalType === 'new-event' ? 'Create New Event' : 
             modalType === 'membership' ? 'Add New Membership' : 
             'Add Event Registration'}
          </h2>
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
                <input
                  type="text"
                  placeholder="College ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.college_id || ''}
                  onChange={(e) => setNewEntry({...newEntry, college_id: e.target.value})}
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
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.membership_status || 'pending'}
                  onChange={(e) => setNewEntry({...newEntry, membership_status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
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
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newEntry.status || 'pending'}
                  onChange={(e) => setNewEntry({...newEntry, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </>
            )}
            {modalType === 'new-event' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                    <input
                      type="text"
                      placeholder="Enter event title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.title || ''}
                      onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.event_type || ''}
                      onChange={(e) => setNewEntry({...newEntry, event_type: e.target.value})}
                      required
                    >
                      <option value="">Select Event Type</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="competition">Competition</option>
                      <option value="meeting">Meeting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Description *</label>
                  <textarea
                    placeholder="Enter event description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                    value={newEntry.description || ''}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.date || ''}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                    <input
                      type="text"
                      placeholder="Enter venue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.venue || ''}
                      onChange={(e) => setNewEntry({...newEntry, venue: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Start *</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.registration_start || ''}
                      onChange={(e) => setNewEntry({...newEntry, registration_start: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration End *</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.registration_end || ''}
                      onChange={(e) => setNewEntry({...newEntry, registration_end: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Fee</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.registration_fee || ''}
                      onChange={(e) => setNewEntry({...newEntry, registration_fee: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Fee</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.member_fee || ''}
                      onChange={(e) => setNewEntry({...newEntry, member_fee: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                    <input
                      type="number"
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newEntry.max_participants || ''}
                      onChange={(e) => setNewEntry({...newEntry, max_participants: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowModal(false);
                setNewEntry({});
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddEntry(modalType)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {modalType === 'new-event' ? 'Create Event' : 
               modalType === 'membership' ? 'Add Membership' : 
               'Add Event Registration'}
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderEventManagement = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Event Management</h2>
        <button
          onClick={() => { setModalType('new-event'); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Event
        </button>
      </div>
      
      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No events found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.venue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.event_type === 'workshop' ? 'bg-blue-100 text-blue-800' :
                      event.event_type === 'seminar' ? 'bg-green-100 text-green-800' :
                      event.event_type === 'competition' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {event.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.registration_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleEventStatus(event.id)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          event.is_active 
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {event.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => {
                          setEventToDelete(event);
                          setShowDeleteConfirm(true);
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderDeleteConfirmModal = () => (
    showDeleteConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the event "{eventToDelete?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteEvent(eventToDelete?.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Event
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
            { id: 'event-management', label: 'Event Management' },
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
          <button
            onClick={() => { setModalType('new-event'); setShowModal(true); }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Create New Event
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
        {activeTab === 'event-management' && renderEventManagement()}
        
        {/* Add Entry Modal */}
        {renderAddEntryModal()}
        
        {/* Delete Confirmation Modal */}
        {renderDeleteConfirmModal()}
      </div>
    </div>
  );
};

export default AdminDashboard;
