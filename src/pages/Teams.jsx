import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

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
      name: 'HBAJA',
      fullName: 'HYDROGEN Baja SAE Team',
      description: 'Designing and building robust all-terrain vehicles for extreme off-road conditions and heavy-duty applications.',
      icon: <img src="/images/teams/BAJA_LW.png"  alt="HBAJA" />,
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      placeholder: <img src="/images/teams/baja.png"  alt="HBAJA" />,
      activities: [
        'All-Terrain Vehicle Design',
        'Off-Road Racing',
        'Heavy-Duty Suspension Systems',
        'Durability Testing',
        'Performance Optimization'
      ],
      achievements: [
        'BAJA SAE India 2024 - 1st Place Design',
        'Best Innovation Award 2023',
        'Endurance Competition Winner 2023'
      ],
      projects: [
        'Hydrogen Baja-XLR8 Vehicle',
        'Advanced Suspension Systems',
        'Roll Cage Design Optimization'
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
    <>
      <Helmet>
        <title>Teams | SAE TKMCE</title>
        <meta name="description" content="Meet the SAE TKMCE teams: VEGHA, HBAJA, SPOX, and more. Learn about our projects, achievements, and engineering focus areas." />
      </Helmet>
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
              Seven Specialized Teams • Engineering Excellence • Innovation in Motion
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400">7</div>
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
            {teams.map((team, index) => (
              <div 
                key={team.name}
                className={`${team.bgColor} rounded-2xl overflow-hidden shadow-xl`}
              >
                <div className="p-8 lg:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Team Info */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="text-6xl mr-4">{team.icon}</div>
                        <div>
                          <h2 className={`text-3xl font-bold ${team.textColor}`}>
                            {team.name}
                          </h2>
                          <p className="text-gray-600 font-medium">
                            {team.fullName}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-lg mb-6">
                        {team.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {team.activities.slice(0, 3).map((activity, idx) => (
                          <span 
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${team.textColor} bg-white`}
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Team Image Placeholder */}
                    <div className="bg-white rounded-xl p-8 shadow-lg">
                      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <div className="w-full h-full">
                          {team.placeholder && (
                            <img 
                              src={team.placeholder.props.src} 
                              alt={team.placeholder.props.alt}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Information */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Activities */}
                    <div className="bg-white rounded-lg p-6 shadow-md">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        🎯 Activities
                      </h3>
                      <ul className="space-y-2">
                        {team.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <span className={`w-2 h-2 rounded-full mr-2 ${team.textColor.replace('text-', 'bg-')}`}></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Achievements */}
                    <div className="bg-white rounded-lg p-6 shadow-md">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        🏆 Achievements
                      </h3>
                      <ul className="space-y-2">
                        {team.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <span className="text-yellow-500 mr-2">★</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Projects */}
                    <div className="bg-white rounded-lg p-6 shadow-md">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        🚀 Current Projects
                      </h3>
                      <ul className="space-y-2">
                        {team.projects.map((project, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <span className="text-blue-500 mr-2">▸</span>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
           
            ))}
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
    </>
  );
};

export default Teams;
