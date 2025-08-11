import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const isRegistrationOpen = (event) => {
    const now = new Date();
    const registrationStart = new Date(event.registration_start);
    const registrationEnd = new Date(event.registration_end);
    return now >= registrationStart && now <= registrationEnd;
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'workshop': 'bg-blue-100 text-blue-800',
      'seminar': 'bg-green-100 text-green-800',
      'competition': 'bg-red-100 text-red-800',
      'meeting': 'bg-purple-100 text-purple-800',
      'other': 'bg-gray-100 text-gray-800',
    };
    return colors[type?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 50px,
                rgba(255,255,255,0.1) 50px,
                rgba(255,255,255,0.1) 51px
              )
            `
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6" style={{fontFamily: 'Almarai, sans-serif'}}>
              <span className="block">UPCOMING</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                EVENTS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Workshops • Competitions • Seminars • Networking Opportunities
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400">{events.length}</div>
                <div className="text-sm text-blue-100">Active Events</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-green-400">{events.filter(e => e.event_type === 'workshop').length}</div>
                <div className="text-sm text-blue-100">Workshops</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-purple-400">{events.filter(e => e.event_type === 'competition').length}</div>
                <div className="text-sm text-blue-100">Competitions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-orange-400">{events.filter(e => isRegistrationOpen(e)).length}</div>
                <div className="text-sm text-blue-100">Open for Registration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 
          className="text-3xl font-bold text-gray-900 mb-8"
          data-aos="fade-up"
        >
          Upcoming Events
        </h1>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 text-lg">No events scheduled at the moment.</p>
            <p className="text-gray-500 mt-2">Check back later for upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                data-aos="fade-up"
              >
                {event.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Event Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getEventTypeColor(event.category)}`}>
                        {(event.category || 'Other').toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {!event.image && (
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getEventTypeColor(event.category)}`}>
                        {(event.category || 'Other').toUpperCase()}
                      </span>
                    )}
                    {!event.image && (
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500">📅</span>
                      <span className="font-medium">Date:</span>
                      <span>{new Date(event.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-500">📍</span>
                      <span className="font-medium">Venue:</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">💰</span>
                      <span className="font-medium">Fee:</span>
                      <span className="font-bold text-green-600">
                        ₹{event.registration_fee || 0}
                      </span>
                    </div>
                    {event.max_participants && (
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-500">👥</span>
                        <span className="font-medium">Max Participants:</span>
                        <span>{event.max_participants}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500 mb-3">
                      Registration: {new Date(event.registration_start).toLocaleDateString()} - {new Date(event.registration_end).toLocaleDateString()}
                    </p>
                    
                    <Link
                      to={`/events/${event.id}`}
                      className="block w-full py-3 px-4 rounded-lg text-sm font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </section>
    </div>
  );
};

export default Events;
