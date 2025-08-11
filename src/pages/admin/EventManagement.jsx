import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/supabaseMock';
import { imageHelpers } from '../../services/imagekit';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [eventId]: true }));
      await adminService.updateEventStatus(eventId, newStatus);
      
      // Update local state
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      );
      
      alert(`Event status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Failed to update event status');
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [eventId]: true }));
      await adminService.deleteEvent(eventId);
      
      // Remove from local state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const getFilteredEvents = () => {
    let filtered = events;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'event_date' || sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: '📝',
      published: '📢',
      cancelled: '❌',
      completed: '✅'
    };
    return icons[status] || '❓';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      workshop: '🛠️',
      competition: '🏆',
      seminar: '🎓',
      social: '🎉',
      technical: '⚙️',
      cultural: '🎭',
      sports: '⚽',
      other: '📋'
    };
    return icons[category] || '📋';
  };

  const isEventUpcoming = (eventDate) => {
    return new Date(eventDate) > new Date();
  };

  const isEventToday = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    return event.toDateString() === today.toDateString();
  };

  const formatEventDate = (eventDate) => {
    const date = new Date(eventDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    
    return date.toLocaleDateString();
  };

  const filteredEvents = getFilteredEvents();

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <span className="text-red-400 mr-2">⚠️</span>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Create and manage events, track registrations</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/admin/forms/events"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            ⚙️ Configure Forms
          </Link>
          <Link
            to="/admin/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            ➕ Create Event
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['draft', 'published', 'completed', 'cancelled'].map(status => {
          const count = events.filter(event => event.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${getStatusColor(status)}`}>
                  <span className="text-lg">{getStatusIcon(status)}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                  <p className="text-2xl font-semibold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">📅 Upcoming Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events
            .filter(event => isEventUpcoming(event.event_date) && event.status === 'published')
            .slice(0, 3)
            .map(event => (
              <div key={event.id} className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{event.title}</h4>
                    <p className="text-sm text-gray-500">{formatEventDate(event.event_date)}</p>
                  </div>
                  <Link
                    to={`/admin/events/${event.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    👁️
                  </Link>
                </div>
              </div>
            ))}
          {events.filter(event => isEventUpcoming(event.event_date) && event.status === 'published').length === 0 && (
            <div className="col-span-3 text-center py-4 text-gray-500">
              No upcoming published events
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="event_date-asc">Event Date (Earliest)</option>
              <option value="event_date-desc">Event Date (Latest)</option>
              <option value="created_at-desc">Recently Created</option>
              <option value="created_at-asc">Oldest Created</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Event Image */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
              {event.banner_url ? (
                <img
                  src={imageHelpers.getEventBanner(event, 'medium')}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl text-white opacity-80">
                    {getCategoryIcon(event.category)}
                  </span>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {getStatusIcon(event.status)} {event.status}
                </span>
              </div>
              
              {/* Date Badge */}
              <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-lg px-2 py-1">
                <div className="text-xs font-bold text-gray-900">
                  {new Date(event.event_date).getDate()}
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            </div>

            {/* Event Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {event.title}
                </h3>
              </div>
              
              {event.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📅</span>
                  <span>{formatEventDate(event.event_date)}</span>
                  {isEventToday(event.event_date) && (
                    <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      Today
                    </span>
                  )}
                </div>
                
                {event.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{event.location}</span>
                  </div>
                )}
                
                {event.max_participants && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👥</span>
                    <span>{event.registration_count || 0} / {event.max_participants} registered</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(event.id, 'published')}
                      disabled={actionLoading[event.id]}
                      className="text-green-600 hover:text-green-700 disabled:opacity-50 text-sm"
                      title="Publish Event"
                    >
                      📢 Publish
                    </button>
                  )}
                  {event.status === 'published' && isEventUpcoming(event.event_date) && (
                    <button
                      onClick={() => handleStatusChange(event.id, 'cancelled')}
                      disabled={actionLoading[event.id]}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50 text-sm"
                      title="Cancel Event"
                    >
                      ❌ Cancel
                    </button>
                  )}
                  {event.status === 'published' && !isEventUpcoming(event.event_date) && (
                    <button
                      onClick={() => handleStatusChange(event.id, 'completed')}
                      disabled={actionLoading[event.id]}
                      className="text-blue-600 hover:text-blue-700 disabled:opacity-50 text-sm"
                      title="Mark Complete"
                    >
                      ✅ Complete
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/events/${event.id}/registrations`}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                    title="View Registrations"
                  >
                    📋
                  </Link>
                  <Link
                    to={`/admin/events/${event.id}/edit`}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                    title="Edit Event"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={actionLoading[event.id]}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 text-sm"
                    title="Delete Event"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first event to get started.'}
          </p>
          <Link
            to="/admin/events/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ➕ Create Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
