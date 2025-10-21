import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoLoader from '../components/VideoLoader';
import api from '../services/api';
import ErrorPage from './ErrorPage';



const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Always fetch fresh events to ensure we have the latest data
    api.get('/events')
      .then((res) => {
        setEvents(res.data);
        sessionStorage.setItem('events', JSON.stringify(res.data));
      })
      .catch((err) => setError(err.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <VideoLoader />;

  if (error) return <ErrorPage />;

  return (
    <><section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
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
          <h1 className="text-4xl md:text-6xl font-black mb-6" style={{ fontFamily: 'Almarai, sans-serif' }}>
            <span className="block">UPCOMING</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              EVENTS
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
            SAE TKMCE
          </p>
        </div>
      </div>
    </section><br></br><section className="py-16">

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         

          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600 text-lg">No events scheduled at the moment.</p>
              <p className="text-gray-500 mt-2">Check back later for upcoming events!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center w-full min-h-[450px]"
                  data-aos="fade-up"
                >
                  <div className="flex flex-col w-full">
                    <div className="aspect-[3/4] w-full">
                      { (event.image_url || (Array.isArray(event.images) && event.images[0])) ? (
                        <img
                          src={event.image_url || event.images[0]}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-t-xl" />
                      ) : (
                        <img src="/SAE.png" alt="Event" className="h-full w-full object-contain rounded-t-xl" />
                      )}
                    </div>
                    {/* Join Now Button */}
                    <div className="w-full">
                      <Link
                        to={`/events/${event.id}`}
                        className="w-full flex items-center justify-center border-blue-500 text-blue-500 font-bold py-3 hover:bg-blue-500 hover:text-white transition-all duration-300 text-sm bg-white"
                      >
                        JOIN NOW
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section></>
  );
};

export default Events;
