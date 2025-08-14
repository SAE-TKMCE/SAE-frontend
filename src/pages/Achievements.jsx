import React, { useState } from 'react';

const Achievements = () => {
  const [selectedYear] = useState('all');
  const [selectedTeam] = useState('all');

  const achievements = [
    {
      year: 'TO BE UPDATED',
      team: 'TO BE UPDATED',
      competition: 'TO BE UPDATED',
      position: 'TO BE UPDATED',
      category: 'TO BE UPDATED',
      location: 'TO BE UPDATED',
      date: 'TO BE UPDATED',
      highlights: [
        'TO BE UPDATED'
      ],
      image: '/images/achievements/formula-sae-2024.jpg',
      description: 'TO BE UPDATED',
      medal: '🥉',
      participants: 25,
      projectBudget: 'TO BE UPDATED'
    },
    {
      year: 'TO BE UPDATED',
      team: 'TO BE UPDATED',
      competition: 'TO BE UPDATED',
      position: 'TO BE UPDATED',
      category: 'TO BE UPDATED',
      location: 'TO BE UPDATED',
      date: 'TO BE UPDATED',
      highlights: [
        'TO BE UPDATED'
      ],
      image: '/images/achievements/baja-sae-2024.jpg',
      description: 'TO BE UPDATED',
      medal: '🥉',
      participants: 25,
      projectBudget: 'TO BE UPDATED'
    },
    {
      year: 'TO BE UPDATED',
      team: 'TO BE UPDATED',
      competition: 'TO BE UPDATED',
      position: 'TO BE UPDATED',
      category: 'TO BE UPDATED',
      location: 'TO BE UPDATED',
      date: 'TO BE UPDATED',
      highlights: [
        'TO BE UPDATED'
      ],
      image: '/images/achievements/shell-eco-2024.jpg',
      description: 'TO BE UPDATED',
      medal: '🥉',
      participants: 25,
      projectBudget: 'TO BE UPDATED'
    },
    {
      year: 'TO BE UPDATED',
      team: 'TO BE UPDATED',
      competition: 'TO BE UPDATED',
      position: 'TO BE UPDATED',
      category: 'TO BE UPDATED',
      location: 'TO BE UPDATED',
      date: 'TO BE UPDATED',
      highlights: [
        'TO BE UPDATED'
      ],
      image: '/images/achievements/fs-electric-2023.jpg',
      description: 'TO BE UPDATED',
      medal: '🥉',
      participants: 25,
      projectBudget: 'TO BE UPDATED'
    },
    {
      year: 'TO BE UPDATED',
      team: 'TO BE UPDATED',
      competition: 'TO BE UPDATED',
      position: 'TO BE UPDATED',
      category: 'TO BE UPDATED',
      location: 'TO BE UPDATED',
      date: 'TO BE UPDATED',
      highlights: [
        'TO BE UPDATED'
      ],
      image: '/images/achievements/mini-baja-2023.jpg',
      description: 'TO BE UPDATED',
      medal: '🥉',
      participants: 25,
      projectBudget: 'TO BE UPDATED'
    },
    {
      year: 'TO BE UPDATED',
      team: 'TO BE UPDATED',
      competition: 'TO BE UPDATED',
      position: 'TO BE UPDATED',
      category: 'TO BE UPDATED',
      location: 'TO BE UPDATED',
      date: 'TO BE UPDATED',
      highlights: [
        'TO BE UPDATED'
      ],
      image: '/images/achievements/sports-meet-2023.jpg',
      description: 'TO BE UPDATED',
      medal: '🥉',
      participants: 25,
      projectBudget: 'TO BE UPDATED'
    },
    {
      year: 'TO BE UPDATED',
      team: 'TO BE UPDATED',
      competition: 'TO BE UPDATED',
      position: 'TO BE UPDATED',
      category: 'TO BE UPDATED',
      location: 'TO BE UPDATED',
      date: 'TO BE UPDATED',
      highlights: [
        'TO BE UPDATED'
      ],
      image: '/images/achievements/formula-sae-2022.jpg',
      description: 'TO BE UPDATED',
      medal: '🥉',
      participants: 25,
      projectBudget: 'TO BE UPDATED'
    },
    {
      year: 'TO BE UPDATED',
      team: 'TO BE UPDATED',
      competition: 'TO BE UPDATED',
      position: 'TO BE UPDATED',
      category: 'TO BE UPDATED',
      location: 'TO BE UPDATED',
      date: 'TO BE UPDATED',
      highlights: [
        'TO BE UPDATED'
      ],
      image: '/images/achievements/supermileage-2022.jpg',
      description: 'TO BE UPDATED',
      medal: '🥉',
      participants: 16,
      projectBudget: 'TO BE UPDATED'
    }
  ];


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
    <>
      <style>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll-infinite {
          animation: scroll-infinite 20s linear infinite;
        }
        
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-12 sm:py-16 lg:py-20">
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
          <div className="text-center mt-8">
            <h1 className="text-4xl md:text-5xl font-black mb-6" style={{fontFamily: 'Almarai, sans-serif'}}>
              <span className="block">OUR</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                ACHIEVEMENTS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Excellence in Competition • Innovation in Engineering • Pride in Performance
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.totalAchievements}</div>
                <div className="text-xs sm:text-sm text-blue-100">Total Awards</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.firstPlaces}</div>
                <div className="text-xs sm:text-sm text-blue-100">First Places</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">{stats.internationalCompetitions}</div>
                <div className="text-xs sm:text-sm text-blue-100">International</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-2xl sm:text-3xl font-bold text-orange-400">{stats.totalParticipants}</div>
                <div className="text-xs sm:text-sm text-blue-100">Participants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Filters removed as requested */}

      {/* Achievements Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredAchievements.map((achievement, index) => (
                <div key={index} className="group relative">
                  {/* Achievement Card */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                    {/* Competition Image */}
                    <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
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
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg">
                          <span className="text-xl sm:text-2xl">{achievement.medal}</span>
                        </div>
                      </div>
                      
                      {/* Year Badge */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <span className="bg-blue-600/90 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
                          {achievement.year}
                        </span>
                      </div>
                      
                      {/* Position Overlay */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                        <h3 className="text-white text-lg sm:text-xl font-bold mb-1 line-clamp-1">{achievement.position}</h3>
                        <p className="text-blue-200 text-xs sm:text-sm line-clamp-1">{achievement.competition}</p>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full line-clamp-1">
                          {achievement.team}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">{achievement.date}</span>
                      </div>
                      
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">
                        {achievement.description}
                      </p>
                      
                      {/* Highlights */}
                      <div className="mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Key Highlights:</h4>
                        <div className="space-y-1">
                          {achievement.highlights.slice(0, 2).map((highlight, idx) => (
                            <div key={idx} className="flex items-center text-xs sm:text-sm text-gray-600">
                              <span className="text-green-500 mr-2 text-xs">✓</span>
                              <span className="line-clamp-1">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-xs sm:text-sm font-semibold text-blue-600">{achievement.participants}</div>
                          <div className="text-xs text-gray-500">Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs sm:text-sm font-semibold text-green-600">{achievement.projectBudget}</div>
                          <div className="text-xs text-gray-500">Budget</div>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-500">
                        <span className="mr-1">📍</span>
                        <span className="line-clamp-1">{achievement.location}</span>
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

      {/* Teams Photo Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Championship Teams</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the teams that made these achievements possible
            </p>
          </div>
          
          {/* Infinite Scroll Photo Gallery */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-infinite space-x-6">
              {/* First set of photos */}
              <div className="flex space-x-6 shrink-0">
                <img src="/images/teams/XLR8Racing.png" alt="XLR8 Racing" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/vegha.png" alt="VEGHA" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/baja.png" alt="BAJA" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/spox.png" alt="SPOX" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/drona.png" alt="DRONA" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/Aerex.png" alt="Aerex" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
              </div>
              {/* Duplicate set for seamless infinite scroll */}
              <div className="flex space-x-6 shrink-0">
                <img src="/images/teams/XLR8Racing.png" alt="XLR8 Racing" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/vegha.png" alt="VEGHA" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/baja.png" alt="BAJA" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/spox.png" alt="SPOX" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/drona.png" alt="DRONA" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <img src="/images/teams/Aerex.png" alt="Aerex" className="h-32 sm:h-40 md:h-48 w-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>
          
          {/* Achievement Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Competition Excellence</h3>
              <p className="text-sm text-gray-600">Consistent performance across multiple SAE competitions</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Engineering Innovation</h3>
              <p className="text-sm text-gray-600">Cutting-edge automotive engineering solutions</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Team Spirit</h3>
              <p className="text-sm text-gray-600">Collaborative excellence driving success</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Create History?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 px-4">
            Join SAE TKMCE and be part of our winning legacy
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto sm:max-w-none">
            <a
              href="/register"
              className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              🏆 Join Our Team
            </a>
            <a
              href="/teams"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300 text-sm sm:text-base"
            >
              🚗 Explore Teams
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Achievements;
