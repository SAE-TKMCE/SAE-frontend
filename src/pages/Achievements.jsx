import React, { useState } from 'react';

const Achievements = () => {
  const [selectedYear] = useState('all');
  const [selectedTeam] = useState('all');

  const achievements = [
    {
      year: '2024',
      team: 'XLR8 Racing',
      competition: 'Formula SAE India',
      position: '3rd Place Overall',
      category: 'formula',
      location: 'Chennai, India',
      date: 'January 2024',
      highlights: [
        'Best Design Award',
        'Fuel Efficiency Challenge Winner',
        'Technical Innovation Recognition'
      ],
      image: '/images/achievements/formula-sae-2024.jpg',
      description: 'Outstanding performance in the most prestigious Formula SAE competition in India, showcasing exceptional engineering and innovation.',
      medal: '🥉',
      participants: 25,
      projectBudget: '₹15,00,000'
    },
    {
      year: '2024',
      team: 'HBAJA',
      competition: 'BAJA SAE India',
      position: '1st Place Design',
      category: 'baja',
      location: 'Pithampur, India',
      date: 'March 2024',
      highlights: [
        'Best Design Report',
        'Innovation in Suspension',
        'Best Presentation'
      ],
      image: '/images/achievements/baja-sae-2024.jpg',
      description: 'Dominated the design category with innovative off-road vehicle engineering and superior technical presentation.',
      medal: '🥇',
      participants: 20,
      projectBudget: '₹8,00,000'
    },
    {
      year: '2024',
      team: 'VEGHA',
      competition: 'Shell Eco-Marathon',
      position: '2nd Place Efficiency',
      category: 'eco',
      location: 'Bengaluru, India',
      date: 'November 2024',
      highlights: [
        'Best Fuel Efficiency',
        'Sustainable Design Award',
        'Innovation in Green Technology'
      ],
      image: '/images/achievements/shell-eco-2024.jpg',
      description: 'Exceptional fuel efficiency and sustainable engineering practices earning recognition in the world\'s most prestigious eco-marathon.',
      medal: '🥈',
      participants: 18,
      projectBudget: '₹6,00,000'
    },
    {
      year: '2023',
      team: 'XLR8 E-racing',
      competition: 'Formula Student Electric',
      position: '5th Place Overall',
      category: 'electric',
      location: 'Silverstone, UK',
      date: 'July 2023',
      highlights: [
        'Best Electric Powertrain',
        'International Recognition',
        'Technical Excellence'
      ],
      image: '/images/achievements/fs-electric-2023.jpg',
      description: 'First international competition participation, achieving remarkable results in electric vehicle engineering.',
      medal: '🏅',
      participants: 22,
      projectBudget: '₹20,00,000'
    },
    {
      year: '2023',
      team: 'MBAJA',
      competition: 'Mini BAJA National',
      position: '4th Place Overall',
      category: 'baja',
      location: 'Mumbai, India',
      date: 'February 2023',
      highlights: [
        'Best Newcomer Team',
        'Cost Report Excellence',
        'Strong Performance'
      ],
      image: '/images/achievements/mini-baja-2023.jpg',
      description: 'Outstanding debut performance in the national mini BAJA championship with innovative engineering solutions.',
      medal: '🏅',
      participants: 15,
      projectBudget: '₹4,00,000'
    },
    {
      year: '2023',
      team: 'SPOX',
      competition: 'National Sports Meet',
      position: '1st Place Organization',
      category: 'events',
      location: 'Kerala, India',
      date: 'October 2023',
      highlights: [
        'Best Event Management',
        'Highest Participation',
        'Seamless Execution'
      ],
      image: '/images/achievements/sports-meet-2023.jpg',
      description: 'Perfectly organized national-level sports meet with record participation and flawless execution.',
      medal: '🥇',
      participants: 50,
      projectBudget: '₹3,00,000'
    },
    {
      year: '2022',
      team: 'XLR8Racing',
      competition: 'Formula SAE India',
      position: '6th Place Overall',
      category: 'formula',
      location: 'Chennai, India',
      date: 'January 2022',
      highlights: [
        'Consistent Performance',
        'Technical Advancement',
        'Team Excellence'
      ],
      image: '/images/achievements/formula-sae-2022.jpg',
      description: 'Solid performance demonstrating continuous improvement and technical excellence in formula racing.',
      medal: '🏅',
      participants: 23,
      projectBudget: '₹12,00,000'
    },
    {
      year: '2022',
      team: 'VEGHA',
      competition: 'SAE SUPERMILEAGE',
      position: '3rd Place',
      category: 'eco',
      location: 'Pune, India',
      date: 'September 2022',
      highlights: [
        'Fuel Efficiency Champion',
        'Lightweight Design',
        'Innovation Award'
      ],
      image: '/images/achievements/supermileage-2022.jpg',
      description: 'Exceptional fuel efficiency achievements with innovative lightweight vehicle design and engineering.',
      medal: '🥉',
      participants: 16,
      projectBudget: '₹5,00,000'
    }
  ];

  // Filters removed; default to showing all

  // Years filter removed

  const filteredAchievements = achievements.filter(achievement => {
    const yearMatch = selectedYear === 'all' || achievement.year === selectedYear;
    const teamMatch = selectedTeam === 'all' || achievement.category === selectedTeam;
    return yearMatch && teamMatch;
  });

  const getTeamStats = () => {
    const stats = {
      totalAchievements: achievements.length,
      firstPlaces: achievements.filter(a => a.position.includes('1st')).length,
      internationalCompetitions: achievements.filter(a => a.location.includes('UK') || a.location.includes('Germany')).length,
      totalParticipants: achievements.reduce((sum, a) => sum + a.participants, 0)
    };
    return stats;
  };

  const stats = getTeamStats();

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
                ACHIEVEMENTS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Excellence in Competition • Innovation in Engineering • Pride in Performance
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400">{stats.totalAchievements}</div>
                <div className="text-sm text-blue-100">Total Awards</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-green-400">{stats.firstPlaces}</div>
                <div className="text-sm text-blue-100">First Places</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-purple-400">{stats.internationalCompetitions}</div>
                <div className="text-sm text-blue-100">International</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-orange-400">{stats.totalParticipants}</div>
                <div className="text-sm text-blue-100">Participants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Filters removed as requested */}

      {/* Achievements Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAchievements.map((achievement, index) => (
                <div key={index} className="group relative">
                  {/* Achievement Card */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                    {/* Competition Image */}
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                      <img
                        src={achievement.image}
                        alt={achievement.competition}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/images/placeholders/achievement-placeholder.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Medal Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <span className="text-2xl">{achievement.medal}</span>
                        </div>
                      </div>
                      
                      {/* Year Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600/90 text-white text-sm font-bold px-3 py-1 rounded-full">
                          {achievement.year}
                        </span>
                      </div>
                      
                      {/* Position Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-bold mb-1">{achievement.position}</h3>
                        <p className="text-blue-200 text-sm">{achievement.competition}</p>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                          {achievement.team}
                        </span>
                        <span className="text-gray-500 text-sm">{achievement.date}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {achievement.description}
                      </p>
                      
                      {/* Highlights */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Highlights:</h4>
                        <div className="space-y-1">
                          {achievement.highlights.slice(0, 3).map((highlight, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <span className="text-green-500 mr-2">✓</span>
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-blue-600">{achievement.participants}</div>
                          <div className="text-xs text-gray-500">Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-green-600">{achievement.projectBudget}</div>
                          <div className="text-xs text-gray-500">Budget</div>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span className="mr-1">📍</span>
                        {achievement.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No achievements found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more achievements.</p>
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Achievement Timeline</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A journey of excellence through the years
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {achievements.slice(0, 6).map((achievement, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">{achievement.medal}</span>
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {achievement.year}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{achievement.position}</h3>
                      <p className="text-blue-600 font-semibold mb-2">{achievement.competition}</p>
                      <p className="text-sm text-gray-600 mb-2">{achievement.team}</p>
                      <p className="text-xs text-gray-500">{achievement.location} • {achievement.date}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className="w-6 h-6 bg-white border-4 border-blue-600 rounded-full shadow-lg"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Create History?</h2>
          <p className="text-xl mb-8">
            Join SAE TKMCE and be part of our winning legacy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              🏆 Join Our Team
            </a>
            <a
              href="/teams"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              🚗 Explore Teams
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Achievements;
