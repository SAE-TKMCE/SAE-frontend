import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventsService } from '../services/events';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await eventsService.getEvent(id);
        setEvent(data);
      } catch (err) {
        console.error('Failed to load event', err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-900 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 text-gray-200">
            <h1 className="text-2xl font-bold text-white mb-2">Event not found</h1>
            <p className="text-gray-400 mb-4">
              The event you are looking for could not be loaded.
            </p>
            <Link
              to="/events"
              className="inline-block border-2 border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-semibold"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const infoRows = [
    { icon: '📅', label: 'Date', value: new Date(event.date).toLocaleString() },
    { icon: '📍', label: 'Venue', value: event.venue || event.location || 'TBA' },
    { icon: '🏷️', label: 'Type', value: event.event_type || event.category || 'Event' },
    { icon: '💰', label: 'Fee', value: `₹${event.registration_fee || 0}${event.member_fee ? ` (₹${event.member_fee} for members)` : ''}` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20 py-12 px-4 flex flex-col items-center justify-center">
      <div className="relative bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        
        {/* Left: Image */}
        <div className="md:w-1/2 w-full aspect-[3/4] bg-gray-900 flex items-center justify-center">
          {(event.image_url || (Array.isArray(event.images) && event.images[0])) ? (
            <img
              src={event.image_url || event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500">No image</div>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 w-full p-6 md:p-10 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: 'Almarai, sans-serif' }}>
            {event.title}
          </h1>
          <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
            {event.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {infoRows.map((row, idx) => (
              <div key={idx} className="flex items-center text-gray-200">
                <span className="w-6">{row.icon}</span>
                <span className="ml-2 text-sm">
                  <span className="text-gray-400 mr-1">{row.label}:</span>
                  <span className="font-medium text-gray-100">{row.value}</span>
                </span>
              </div>
            ))}
          </div>

          {(event.registration_start || event.registration_end) && (
            <div className="text-xs text-gray-400/90 mb-6">
              Registration window:{' '}
              {event.registration_start
                ? new Date(event.registration_start).toLocaleDateString()
                : 'N/A'}{' '}
              –{' '}
              {event.registration_end
                ? new Date(event.registration_end).toLocaleDateString()
                : 'N/A'}
            </div>
          )}

          <div className="mt-auto">
            <a
              href="https://app.makemypass.com/org/sae-tkmce"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold uppercase tracking-wide border-2 border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <span className="flex items-center gap-2">
                <span>Register Now</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5-5 5M6 12h12"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
      {/* Back button below the card */}
      <div className="mt-6 text-center w-full max-w-4xl">
        <Link to="/events" className="text-blue-400 hover:text-blue-300 text-lg font-semibold">
          ← Back to Events
        </Link>
      </div>
    </div>
  );
};

export default EventDetail;
