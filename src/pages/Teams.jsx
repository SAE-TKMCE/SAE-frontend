import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';

function TeamsCarousel({ team }) {
  const [activeCard, setActiveCard] = useState(0);

  if (!team) {
    return <div className="text-white text-center py-8">Loading team...</div>;
  }

  const cardViews = [
    // Main Info Card
    (
      <div className="flex flex-col h-full">
        {/* Team Image - Portrait style at top with rounded edges */}
        <div className="w-full flex-shrink-0 bg-transparent rounded-lg h-32 lg:h-40 flex items-center justify-center overflow-hidden mb-4">
          <img 
            src={team.placeholder.props.src} 
            alt={team.placeholder.props.alt} 
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Team Info - Scrollable section with better spacing */}
        <div className="flex-grow overflow-y-auto px-0 py-0">
          {/* Team Logo and Name - Centered */}
          <div className="flex flex-col items-center justify-center mb-4 text-center">
            <div className="w-20 h-20 flex items-center justify-center mb-3 bg-white/10 rounded-full p-2">
              {team.icon}
            </div>
            <h2 className={`text-2xl font-bold ${team.textColor}`}>{team.name}</h2>
            <p className="text-gray-600 font-semibold text-sm mt-1">{team.fullName}</p>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-4 leading-relaxed text-center px-2">{team.description}</p>

          {/* Activities Section */}
          <div className="mb-4 px-2">
            <h3 className={`text-sm font-bold ${team.textColor} mb-2 uppercase tracking-wider`}>Key Activities</h3>
            <div className="space-y-1.5">
              {team.activities.slice(0, 3).map((activity, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className={`${team.textColor} text-lg leading-none flex-shrink-0 mt-0.5`}>•</span>
                  <span className="text-gray-700 text-xs leading-snug">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="px-2">
            <h3 className={`text-sm font-bold ${team.textColor} mb-2 uppercase tracking-wider`}>Highlights</h3>
            <div className="space-y-1">
              {team.achievements.slice(0, 2).map((ach, idx) => (
                <div key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className={`${team.textColor} text-lg leading-none flex-shrink-0`}>★</span>
                  <span className="leading-snug">{ach}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    // Activities/Achievements/Projects Grid - Expanded
    (
      <div className="h-full overflow-y-auto px-2 py-2">
        <div className="space-y-3">
          {/* Activities */}
          <div>
            <h3 className={`text-sm font-bold mb-2 ${team.textColor} uppercase tracking-wider`}>Activities</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {team.activities.map((activity, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg p-2 shadow text-gray-700 font-medium text-xs line-clamp-2 border-l-2" style={{borderColor: team.textColor.replace('text-', '')}}>
                  {activity}
                </div>
              ))}
            </div>
          </div>
          
          {/* Achievements */}
          <div>
            <h3 className={`text-sm font-bold mb-2 ${team.textColor} uppercase tracking-wider`}>Achievements</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {team.achievements.map((ach, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg p-2 shadow text-gray-700 font-medium text-xs line-clamp-2 border-l-2" style={{borderColor: team.textColor.replace('text-', '')}}>
                  {ach}
                </div>
              ))}
            </div>
          </div>
          
          {/* Projects */}
          <div>
            <h3 className={`text-sm font-bold mb-2 ${team.textColor} uppercase tracking-wider`}>Projects</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {team.projects.map((proj, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg p-2 shadow text-gray-700 font-medium text-xs line-clamp-2 border-l-2" style={{borderColor: team.textColor.replace('text-', '')}}>
                  {proj}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  ];

  return (
    <div className={`${team.bgColor} rounded-2xl overflow-hidden shadow-2xl relative w-full flex flex-col`}
      style={{
        height: 'clamp(450px, 85vh, 650px)',
      }}>
      <div className="flex-grow flex flex-col overflow-hidden p-5 lg:p-6">
        {cardViews[activeCard]}
      </div>
      
      {/* Card Indicators */}
      <div className="flex justify-center gap-2 px-6 py-4 border-t border-gray-300 bg-white/60 flex-shrink-0">
        <button
          onClick={() => setActiveCard(0)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            activeCard === 0 ? 'bg-blue-600 w-8' : 'bg-gray-400'
          }`}
          aria-label="Card 1"
        />
        <button
          onClick={() => setActiveCard(1)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            activeCard === 1 ? 'bg-blue-600 w-8' : 'bg-gray-400'
          }`}
          aria-label="Card 2"
        />
      </div>
    </div>
  );
}

const Teams = () => {
  const teams = [
    {
      name: 'VEGHA',
      fullName: 'VEGHA SAE TEAM',
      description: 'Focusing on sustainable and environmentally friendly Electric Two Wheeler technologies.',
      icon: <img src="/images/teams/veghalogo.png" alt="VEGHA" />,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      placeholder: <img src="/images/teams/vegha.png" alt="VEGHA" />,
      activities: [
        'Design of Electric Two Wheelers',
        'Development of Battery Management Systems',
        'Lightweight Frame Design',
        'Cost-Effective Solutions'
      ],
      achievements: [
        'AIR 5 in the Design Event',
        '3rd Rank in Kerala',
        'AIR 7 in the Cost Event at SAE 2025'
      ],
      projects: [
        'Hybrid Electric Prototype',
        'Fuel Cell Technology Research',
        'Solar Panel Integration Systems'
      ]
    },
    {
      name: 'DRONA',
      fullName: 'DRONA SAE Team',
      description: 'Creating compact, agile, and high-performance vehicles for mini baja competitions.',
      icon: <img src="/images/teams/DRONA_LW.png" alt="DRONA" />,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      placeholder: <img src="/images/teams/drona.png" alt="DRONA" />,
      activities: [
        'Design of Drones',
        'Battery Management Systems',
        '3D Printing on Drones',
        'Cost-Effective Solutions'
      ],
      achievements: [
        'AIR 5 in the Design Event',
        '3rd Rank in Kerala',
        'AIR 7 in the Cost Event'
      ],
      projects: [
        'Mini Baja Racing Vehicle',
        'Lightweight Chassis Design',
        'Compact Powertrain Systems'
      ]
    },
    {
      name: 'XLR8 Racing',
      fullName: 'Formula SAE Racing Team',
      description: 'Building high-performance formula-style racing cars for national competitions.',
      icon: <img src="/images/teams/xlr8-racing.png" alt="XLR8 Racing" />,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      placeholder: <img src="/images/teams/XLR8Racing.png" alt="XLR8" />,
      activities: [
        'Formula Racing',
        'High-Performance Tuning',
        'Aerodynamics',
        'Engine Optimization'
      ],
      achievements: [
        'Formula SAE India 2024 - 3rd Place',
        'Best Presentation Award 2023',
        'Technical Innovation Prize 2023'
      ],
      projects: [
        'Formula SAE Racing Car',
        'Aerodynamic Package Design',
        'Engine Management Systems'
      ]
    },
    {
      name: 'XLR8FST',
      fullName: 'Formula Student Racing Team',
      description: 'Competing in international Formula Student competitions with advanced technologies.',
      icon: <img src="/images/teams/xlr8-fst.png" alt="XLR8FST" />,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      placeholder: <img src="/images/teams/xlr8-formula.png" alt="XLR8FST" />,
      activities: [
        'Formula Student Competition',
        'International Standards',
        'Advanced Innovation',
        'Global Competition'
      ],
      achievements: [
        'Formula Student Germany 2023 - Participation',
        'Best Rookie Team Award 2023',
        'Innovation Excellence 2023'
      ],
      projects: [
        'Formula Student Racing Car',
        'International Competition Prep',
        'Advanced Telemetry Systems'
      ]
    },
    {
      name: 'Aerex',
      fullName: 'Fixed Wing UAV Team',
      description: 'Designing and constructing next-generation fixed-wing UAVs.',
      icon: <img src="/images/teams/Aerex-logo.png" alt="Aerex" />,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      placeholder: <img src="/images/teams/Aerex.png" alt="Aerex" />,
      activities: [
        'Design of UAVs',
        'Modular Assembly',
        'Aerodynamics'
      ],
      achievements: [
        'Overall Rank 36 in SAE Drone Challenge'
      ],
      projects: [
        'Fixed Wing UAV Prototype',
        'Advanced Battery Management'
      ]
    },
    {
      name: 'SPOX',
      fullName: 'Electric Bicycle Design Team',
      description: 'Designing high-efficiency electric bicycles with focus on sustainable mobility.',
      icon: <img src="/images/teams/SPOX-LOGO.png" alt="SPOX" />,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      placeholder: <img src="/images/teams/spox.png" alt="SPOX" />,
      activities: [
        'E-bike Frame Design',
        'Battery Management Systems',
        'Motor & Controller Tuning',
        'Energy Efficiency Testing'
      ],
      achievements: [
        'E-Bike Challenge 2024 - Top 5',
        'Best Energy Efficiency Award 2023',
        'Lightweight Design Recognition'
      ],
      projects: [
        'City Commuter E-Bike Prototype',
        'Advanced BMS for E-Bicycles',
        'Regenerative Braking Integration'
      ]
    }
  ];

  const [activeTeam, setActiveTeam] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleWheel = (e) => {
      const container = document.querySelector('.teams-scroll-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isInView) return;

      e.preventDefault();

      const maxTeams = teams.length;
      const newProgress = (scrollProgress + (e.deltaY > 0 ? 1 : -1) + maxTeams) % maxTeams;
      setScrollProgress(newProgress);
      setActiveTeam(newProgress);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollProgress, teams.length]);

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
        <div className="absolute inset-0 opacity-11">
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
                rgba(255,255,255,0.0) 50px,
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
            backgroundSize: '800px 800px, 600px 6000, 700px 700px'
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Teams</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Meet the talented teams driving innovation at SAE TKMCE
          </p>
        </div>
      </section>

      {/* Sticky Stacking Teams Section */}
      <div className="relative z-20 flex-grow">
        <div className="teams-scroll-container sticky top-0 h-screen flex items-center justify-center bg-gray-900 py-8 lg:py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* Card Container - Responsive sizing */}
            <div className="w-full max-w-sm lg:max-w-3xl">
              <TeamsCarousel team={teams[activeTeam]} />
            </div>
            
            {/* Team Navigation Indicators */}
            <div className="flex justify-center gap-2 mt-6 lg:mt-8 flex-wrap max-w-2xl mx-auto">
              {teams.map((team, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTeam(idx);
                    setScrollProgress(idx);
                  }}
                  className={`px-3 py-1 rounded-full text-xs lg:text-sm transition-all duration-300 ${
                    activeTeam === idx
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                  }`}
                  title={team.name}
                >
                  {team.name}
                </button>
              ))}
            </div>

            {/* Scroll Hint */}
            <div className="text-center mt-6 lg:mt-8 text-gray-400">
              <p className="text-xs lg:text-sm">Scroll or click to navigate through teams</p>
            </div>
          </div>
        </div>

        {/* Join CTA Section */}
        <section className="relative min-h-screen bg-gray-800 flex items-center py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Join a Team?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Choose your preferred team during registration and become part of our automotive engineering community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              >
                Register Now
              </Link>
              <Link
                to="/contact"
                className="border-2 border-blue-400 text-blue-300 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-300 transform hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer - Only render once */}
      <Footer />
    </div>
  );
};

export default Teams;
