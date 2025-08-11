import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventsService } from '../services/events';

const styles = `
  @keyframes gridMove {
    0% { background-position: 0 0; }
    100% { background-position: 80px 80px; }
  }
`;

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
            <p className="text-gray-400 mb-4">The event you are looking for could not be loaded.</p>
            <Link to="/events" className="inline-block border-2 border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-semibold">Back to Events</Link>
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
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
        {/* Subtle moving grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              animation: 'gridMove 22s ease-in-out infinite alternate'
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          {/* Radial spotlight behind the card to make it pop */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.12), rgba(0,0,0,0) 55%)'
            }}
          />

          <div className="mb-6 relative z-10">
            <Link to="/events" className="text-blue-400 hover:text-blue-300">← Back to Events</Link>
          </div>

          {/* Notebook-style card */}
          <div className="relative z-10 bg-gray-800/80 backdrop-blur-xl border border-white/10 ring-1 ring-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Image Pane */}
              <div className="relative h-64 md:h-full bg-gray-900">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                )}
                {/* Binding effect */}
                <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-px bg-white/10" />
              </div>

              {/* Right: Details Pane */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="mb-5">
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{fontFamily: 'Almarai, sans-serif'}}>
                    {event.title}
                  </h1>
                  <p className="text-gray-200/90 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>

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
                    Registration window: {event.registration_start ? new Date(event.registration_start).toLocaleDateString() : 'N/A'}
                    {' '}–{' '}
                    {event.registration_end ? new Date(event.registration_end).toLocaleDateString() : 'N/A'}
                  </div>
                )}

                <div className="mt-auto pt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/events/${event.id}/register`}
                      className="group inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold uppercase tracking-wide border-2 border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      <span className="flex items-center gap-2">
                        <span>Register Now</span>
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5-5 5M6 12h12" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
