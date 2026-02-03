import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoLoader from '../components/VideoLoader';
import api from '../services/api';
import ErrorPage from './ErrorPage';
import Footer from '../components/layout/Footer';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Fixed Hero Background */}
      <div className="fixed inset-0 h-screen bg-gray-900 z-0">
        {/* Ceiling Grid Background Image */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url('/images/ceiling-grid.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full" style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 50px,
                rgba(255,255,255,0.1) 50px,
                rgba(255,255,255,0.1) 51px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 50px,
                rgba(255,255,255,0.1) 50px,
                rgba(255,255,255,0.1) 51px
              )
            `
          }}></div>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Radial Gradients */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)`,
            backgroundSize: '800px 800px, 600px 600px, 700px 700px'
          }}></div>
        </div>

        {/* Floating Bubble Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
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
      </div>

      {/* Hero Content */}
      <section className="relative h-screen flex items-center justify-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & Competitions</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Join us in exciting automotive engineering competitions and events
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="relative z-20 flex-grow">
        <section className="relative min-h-screen bg-gray-900 flex items-center py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-300 text-lg">No events scheduled at the moment.</p>
                <p className="text-gray-400 mt-2">Check back later for upcoming events!</p>
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
                        {(event.image_url || (Array.isArray(event.images) && event.images[0])) ? (
                          <img
                            src={event.image_url || event.images[0]}
                            alt={event.title}
                            className="w-full h-full object-cover rounded-t-xl"
                          />
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
        </section>
      </div>

      {/* Footer - Rendered only once at the end */}
      <Footer />
    </div>
  );
};

export default Events;
