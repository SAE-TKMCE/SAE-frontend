import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RegistrationForm from '../components/forms/RegistrationForm';

// Add custom styles for the grid animation
const styles = `
  @keyframes gridMove {
    0% { background-position: 0 0; }
    100% { background-position: 100px 100px; }
  }
`;

const Register = () => {
  const location = useLocation();
  const initialPosition = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('position');
  }, [location.search]);

  const [selectedPosition, setSelectedPosition] = useState(initialPosition);

  const positions = [
    {
      id: 'web-team-2026',
      title: 'WEB Team 2026',
      status: 'Open',
      deadline: '7th February',
      summary: 'Recruitment for SAE TKMCE Web Team (2026).',
      projects: [
        'SAE TKMCE official website revamp',
        'Event registration & management portal',
        'Member dashboard & profile system',
        'Design templates and content tools',
        'Performance, accessibility, and SEO improvements'
      ]
    }
  ];

  const activePosition = positions.find(p => p.id === selectedPosition);

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white py-20 px-4 relative overflow-hidden">
        
        {/* Ceiling Grid Background Image */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url('/images/ceiling-grid.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat'
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

        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Join SAE TKMCE</h1>
            <p className="text-xl text-indigo-100 mb-2">Open positions and recruitment updates</p>
            <p className="text-lg text-indigo-200">Select a role to view details and apply</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
            <div className="space-y-4">
              {positions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setSelectedPosition(pos.id)}
                  className={`w-full text-left p-4 rounded-xl border transition duration-300 ${
                    selectedPosition === pos.id
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-white/20 hover:border-blue-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold">{pos.title}</h3>
                      <p className="text-sm text-indigo-100">{pos.summary}</p>
                    </div>
                    <div className="text-sm">
                      <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-200 mr-2">
                        Status: {pos.status}
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-200">
                        Deadline: {pos.deadline}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {activePosition && (
            <div className="mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-6 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">{activePosition.title} Recruitment</h2>
                    <p className="text-indigo-100">Status: {activePosition.status}</p>
                  </div>
                  <div className="text-sm">
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-200">
                      Deadline: {activePosition.deadline}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-3">Projects We'll Build with the Web Team</h3>
                <ul className="list-disc list-inside text-indigo-100 space-y-2">
                  {activePosition.projects.map((proj, idx) => (
                    <li key={idx}>{proj}</li>
                  ))}
                </ul>
              </div>

              <RegistrationForm />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
