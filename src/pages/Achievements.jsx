import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorPage from './ErrorPage';
import VideoLoader from '../components/VideoLoader';

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
      axios.get('http://localhost:8000/api/achievements/')
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
            `}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6" style={{fontFamily: 'Almarai, sans-serif'}}>
              <span className="block">OUR</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                ACHIEVEMENTS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Celebrating Excellence • Innovation • Teamwork
            </p>
          </div>
        </div>
      </section>
      {/* Achievements Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black mb-10 text-center text-blue-900">Team Achievements</h1>
        {loading ? (
          <div className="text-center text-blue-700">Loading achievements...</div>
        ) : error ? (
          <ErrorPage code={500} message="Internal Error" details={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((ach, idx) => (
              <div key={ach.id || idx} className="bg-white rounded-2xl shadow-lg p-6">
                <ImageSlider images={Array.isArray(ach.images) ? ach.images : (ach.images ? [ach.images] : [])} />
                <h3 className="text-lg font-semibold text-blue-500 mb-2">{ach.year_achieved}</h3>
                <h2 className="text-xl font-bold text-blue-700 mb-2">{ach.description}</h2>
                <ul className="list-disc list-inside text-gray-700 mb-2">
                  <li>{ach.title}</li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
