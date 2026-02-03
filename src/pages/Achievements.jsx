import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorPage from './ErrorPage';
import VideoLoader from '../components/VideoLoader';
import Footer from '../components/layout/Footer';

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) {
    // Fallback image if no images provided
    return (
      <div className="mb-4">
        <div className="relative h-48 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
          <img src="/SAE.png" alt="Achievement" className="h-full w-full object-cover" style={{borderRadius: '1rem'}} />
        </div>
      </div>
    );
  }
  return (
    <div className="mb-4">
      <div className="relative h-48 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
        <img src={images[current]} alt="Achievement" className="h-full w-full object-cover" style={{borderRadius: '1rem'}} />
        {images.length > 1 && (
          <>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1 text-blue-700" onClick={() => setCurrent((current - 1 + images.length) % images.length)}>&lt;</button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1 text-blue-700" onClick={() => setCurrent((current + 1) % images.length)}>&gt;</button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {images.map((img, i) => (
            <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === current ? 'bg-blue-700' : 'bg-gray-300'}`}></span>
          ))}
        </div>
      )}
    </div>
  );
}

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const cached = sessionStorage.getItem('achievements');
    if (cached) {
      setAchievements(JSON.parse(cached));
      setLoading(false);
    } else {
      axios.get('https://sae-backend-fux7.onrender.com/api/achievements/')
        .then(res => {
          setAchievements(res.data);
          sessionStorage.setItem('achievements', JSON.stringify(res.data));
        })
        .catch(err => {
          setError('Failed to load achievements');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <VideoLoader />;

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Achievements</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Celebrating our success and contributions to automotive engineering
          </p>
        </div>
      </section>

      {/* Sticky Stacking Scroll Section */}
      <div className="relative z-20">
        <section className="relative min-h-screen bg-gray-900 flex items-center py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-4xl font-black mb-10 text-center text-white">Team Achievements</h1>
            {error ? (
              <ErrorPage code={500} message="Internal Error" details={error} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((ach, idx) => (
                  <div key={ach.id || idx} className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20 hover:border-blue-400 transition-all duration-300 transform hover:scale-105">
                    <ImageSlider images={Array.isArray(ach.images) ? ach.images : (ach.images ? [ach.images] : [])} />
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">{ach.year_achieved}</h3>
                    <h2 className="text-xl font-bold text-white mb-2">{ach.description}</h2>
                    <ul className="list-disc list-inside text-gray-200 mb-2">
                      <li>{ach.title}</li>
                    </ul>
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

export default Achievements;
