import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function TeamsCarousel({ teams }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState('down');

  const handleNextTeam = () => {
    setDirection('down');
    setTransitioning(true);
    setTimeout(() => {
      setActiveIndex((activeIndex + 1) % teams.length);
      setTransitioning(false);
      setCardIndex(0);
    }, 350);
  };
  const handlePrevTeam = () => {
    setDirection('up');
    setTransitioning(true);
    setTimeout(() => {
      setActiveIndex((activeIndex - 1 + teams.length) % teams.length);
      setTransitioning(false);
      setCardIndex(0);
    }, 350);
  };
  const handleNextCard = () => {
    setCardIndex(1);
  };
  const handlePrevCard = () => {
    setCardIndex(0);
  };

  const team = teams[activeIndex];
  const cardViews = [
    // Main Info Card
    (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center transition-all duration-300 ${transitioning && direction==='down' ? 'translate-y-32 opacity-0' : 'translate-y-0 opacity-100'} ${transitioning && direction==='up' ? '-translate-y-32 opacity-0' : ''}`}>
        {/* Team Info */}
        <div>
          <div className="flex items-center mb-4">
            <div className="text-6xl mr-4">{team.icon}</div>
            <div>
              <h2 className={`text-3xl font-bold ${team.textColor}`}>{team.name}</h2>
              <p className="text-gray-600 font-medium">{team.fullName}</p>
            </div>
          </div>
          <p className="text-gray-700 text-lg mb-6">{team.description}</p>
          <div className="flex flex-wrap gap-2">
            {team.activities.slice(0, 3).map((activity, idx) => (
              <span key={idx} className={`px-3 py-1 rounded-full text-sm font-medium ${team.textColor} bg-white`}>{activity}</span>
            ))}
          </div>
        </div>
        {/* Team Image Placeholder */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <div className="w-full h-full">
              {team.placeholder && (
                <img src={team.placeholder.props.src} alt={team.placeholder.props.alt} className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    // Activities/Achievements/Projects Grid
    (
      <div className={`p-4 transition-all duration-300`}>
        <h3 className={`text-2xl font-bold mb-4 ${team.textColor}`}>Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {team.activities.map((activity, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow text-gray-700 font-medium">{activity}</div>
          ))}
        </div>
        <h3 className={`text-2xl font-bold mb-4 ${team.textColor}`}>Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {team.achievements.map((ach, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow text-gray-700 font-medium">{ach}</div>
          ))}
        </div>
        <h3 className={`text-2xl font-bold mb-4 ${team.textColor}`}>Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.projects.map((proj, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow text-gray-700 font-medium">{proj}</div>
          ))}
        </div>
      </div>
    )
  ];
  return (
    <div className={`${team.bgColor} rounded-2xl overflow-hidden shadow-xl relative`}>
      <div className="p-8 lg:p-12">
        {cardViews[cardIndex]}
        {/* Arrow Button for Next/Prev Card */}
        {cardIndex === 0 && (
          <button
            className="absolute bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition"
            onClick={handleNextCard}
            aria-label="Next"
            disabled={transitioning}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {cardIndex === 1 && (
          <button
            className="absolute bottom-6 left-6 bg-gray-300 text-blue-600 rounded-full p-3 shadow-lg hover:bg-gray-400 transition"
            onClick={handlePrevCard}
            aria-label="Back"
            disabled={transitioning}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {/* Up/Down Arrow Buttons for Carousel */}
        {cardIndex === 0 && (
          <>
            <button
              className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-300 text-blue-600 rounded-full p-3 shadow-lg hover:bg-gray-400 transition"
              onClick={handlePrevTeam}
              aria-label="Prev Team"
              disabled={transitioning}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
            <button
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-300 text-blue-600 rounded-full p-3 shadow-lg hover:bg-gray-400 transition"
              onClick={handleNextTeam}
              aria-label="Next Team"
              disabled={transitioning}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </button>
          </>
        )}
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
      icon: <img src="/images/teams/veghalogo.png"  alt="VEGHA" />,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      placeholder: <img src="/images/teams/vegha.png"  alt="VEGHA" />,
      activities: [
        'Design of Electric Two Wheelers',
        'Development of Battery Management Systems',
        'Lightweight Frame Design',
        'Cost-Effective Solutions'
      ],
      achievements: [
        'AIR 5 in the Design Event ',
        '3rd Rank in Kerala',
        'AIR 7 in the Cost Event at the SAE 2025 competition held at NATRAX, Madhya Pradesh'
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
      description: 'Creating compact, agile, and high-performance vehicles for mini baja competitions and recreational use.',
      icon: <img src="/images/teams/DRONA_LW.png"  alt="VEGHA" />,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      placeholder: <img src="/images/teams/drona.png"  alt="DRONA" />,
      activities: [
        'Design of Drones',
        'Development of Battery Management Systems',
        'Utilizing 3D Printing on Drones',
        'Cost-Effective Solutions'
      ],
      achievements: [
        'AIR 5 in the Design Event ',
        '3rd Rank in Kerala',
        'AIR 7 in the Cost Event at the SAE DRONA 2025 competition held at NATRAX, Madhya Pradesh'
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
      description: 'Building high-performance formula-style racing cars for national and international competitions.',
      icon: <img src="/images/teams/xlr8-racing.png"  alt="XLR8 Racing" />,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      placeholder: <img src="/images/teams/XLR8Racing.png"  alt="XLR8" />,
      activities: [
        'Formula Racing',
        'High-Performance Tuning',
        'Aerodynamics',
        'Engine Optimization',
        'Professional Racing'
      ],
      achievements: [
        'Formula SAE India 2024 - 3rd Place Overall',
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
      description: 'Competing in international Formula Student competitions with cutting-edge automotive technologies.',
      icon: <img src="/images/teams/xlr8-fst.png"  alt="XLR8FST" />,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      placeholder: <img src="/images/teams/xlr8-formula.png"  alt="XLR8FST" />,
      activities: [
        'Formula Student Competition',
        'International Standards',
        'Advanced Innovation',
        'Global Competition',
        'Technical Excellence'
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
      fullName: 'Fixed Wing UAV Team ',
      description: 'Designing and constructing next-generation fixed-wing UAVs.',
      icon: <img src="/images/teams/Aerex-logo.png"  alt="Aerex" />,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      placeholder: <img src="/images/teams/Aerex.png"  alt="Aerex" />,
      activities: [
        'Design of UAVs',
        'Modular Assembly',
        'Aerodynamics',
      ],
      achievements: [
        'Overall Rank 36 in SAE Drone Development Challenge',
      ],
      projects: [
        'Fixed Wing UAV Prototype',
        'Advanced Battery Management'
      ]
    },
    {
      name: 'SPOX',
      fullName: 'Electric Bicycle Design Team',
      description: 'Designing and building high-efficiency electric bicycles with a focus on powertrain, battery management, and sustainable mobility.',
      icon: <img src="/images/teams/SPOX-LOGO.png"  alt="SPOX" />,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      placeholder: <img src="/images/teams/spox.png"  alt="SPOX" />,
      activities: [
        'E-bike Frame Design',
        'Battery Management Systems',
        'Motor & Controller Tuning',
        'Energy Efficiency Testing',
        'Urban Mobility Research'
      ],
      achievements: [
        'E-Bike Challenge 2024 - Top 5',
        'Best Energy Efficiency Award 2023',
        'Lightweight Design Recognition 2023'
      ],
      projects: [
        'City Commuter E-Bike Prototype',
        'Advanced BMS for E-Bicycles',
        'Regenerative Braking Integration'
      ]
    }
  ];

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
              <span className="block">OUR</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                TEAMS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Six Specialized Teams • Engineering Excellence • Innovation in Motion
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400">6</div>
                <div className="text-sm text-blue-100">Active Teams</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-green-400">150+</div>
                <div className="text-sm text-blue-100">Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-purple-400">25+</div>
                <div className="text-sm text-blue-100">Competitions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-orange-400">50+</div>
                <div className="text-sm text-blue-100">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12">
            <TeamsCarousel teams={teams} />
          </div>
        </div>
      </section>

      {/* Join CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join a Team?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Choose your preferred team during registration and become part of our automotive engineering community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Register Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Teams;
