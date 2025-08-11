import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextMock';
import { eventsService } from '../services/events';

const Home = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await eventsService.getEvents();
        // Get the next 3 upcoming events
        const upcoming = events.slice(0, 3);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Don't throw error for unauthenticated requests on Home page
        // Just show empty events or default content
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegistrationClick = () => {
    console.log('🟢 Button clicked! Redirecting to registration page');
    // Redirect to register page instead of opening modal
    window.location.href = '/register';
  };

  const teams = [
    {
      name: 'VEGHA',
      description: 'Vehicle Engineering & Green Hybrid Automotive',
      icon: (
        <svg width="48" height="32" viewBox="0 0 90 50" className="stroke-current fill-none stroke-2">
          <path d="M15 35 L25 30 L65 30 L75 35 L75 40 L65 40 L25 40 L15 40 Z" />
          <circle cx="25" cy="40" r="6" />
          <circle cx="65" cy="40" r="6" />
          <path d="M30 30 L35 25 L55 25 L60 30" />
          <path d="M40 20 L45 15 L50 20" />
        </svg>
      ),
      color: 'from-green-400 to-green-600',
      activities: ['Hybrid Vehicle Design', 'Fuel Efficiency', 'Green Technology']
    },
    {
      name: 'HBAJA',
      description: 'Heavy Baja SAE Team',
      icon: (
        <svg width="48" height="28" viewBox="0 0 110 50" className="stroke-current fill-none stroke-2">
          <path d="M15 35 L25 30 L35 25 L75 25 L85 30 L95 35 L95 40 L85 40 L25 40 L15 40 Z" />
          <circle cx="30" cy="40" r="6" />
          <circle cx="80" cy="40" r="6" />
          <path d="M40 25 L45 20 L65 20 L70 25" />
          <rect x="20" y="15" width="8" height="8" />
        </svg>
      ),
      color: 'from-red-400 to-red-600',
      activities: ['All-Terrain Vehicle', 'Off-Road Racing', 'Suspension Design']
    },
    {
      name: 'MBAJA',
      description: 'Mini Baja SAE Team',
      icon: (
        <svg width="48" height="32" viewBox="0 0 80 80" className="stroke-current fill-none stroke-2">
          <path d="M20 10 L20 70" />
          <path d="M20 10 L60 10 L50 20 L60 30 L50 40 L60 50 L20 50" />
          <rect x="20" y="10" width="10" height="10" className="fill-current opacity-50" />
          <rect x="40" y="10" width="10" height="10" className="fill-current opacity-50" />
        </svg>
      ),
      color: 'from-orange-400 to-orange-600',
      activities: ['Mini Baja Competition', 'Vehicle Dynamics', 'Frame Design']
    },
    {
      name: 'XLR8 Racing',
      description: 'Formula SAE Racing Team',
      icon: (
        <svg width="48" height="24" viewBox="0 0 120 60" className="stroke-current fill-none stroke-2">
          <path d="M10 40 L20 35 L40 30 L80 30 L100 35 L110 40 L100 45 L80 45 L40 45 L20 45 Z" />
          <circle cx="25" cy="45" r="8" />
          <circle cx="95" cy="45" r="8" />
          <path d="M40 25 L45 20 L65 20 L70 25" />
          <path d="M30 30 L35 25 L75 25 L80 30" />
        </svg>
      ),
      color: 'from-blue-400 to-blue-600',
      activities: ['Formula Racing', 'Performance Tuning', 'Aerodynamics']
    },
    {
      name: 'XLR8FST',
      description: 'Formula Student Racing Team',
      icon: (
        <svg width="48" height="48" viewBox="0 0 100 100" className="stroke-current fill-none stroke-2">
          <circle cx="50" cy="60" r="25" />
          <path d="M35 45 L50 25 L65 45" />
          <path d="M40 40 L60 40" />
          <circle cx="50" cy="30" r="3" className="fill-current" />
        </svg>
      ),
      color: 'from-purple-400 to-purple-600',
      activities: ['Formula Student', 'International Competition', 'Innovation']
    },
    {
      name: 'XLR8 E-racing',
      description: 'Electric Racing Team',
      icon: (
        <svg width="48" height="40" viewBox="0 0 80 100" className="stroke-current fill-none stroke-3">
          <path d="M30 10 L50 10 L35 40 L55 40 L25 90 L45 60 L25 60 L30 10 Z" />
        </svg>
      ),
      color: 'from-yellow-400 to-yellow-600',
      activities: ['Electric Vehicles', 'Battery Technology', 'Sustainability']
    },
    {
      name: 'SPOX',
  description: 'Electric Bicycle Design Team',
      icon: (
        <svg width="48" height="48" viewBox="0 0 100 100" className="stroke-current fill-none stroke-2">
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="20" />
          <circle cx="50" cy="50" r="10" />
          <circle cx="50" cy="50" r="3" className="fill-current" />
          <path d="M50 20 L50 15" />
          <path d="M50 80 L50 85" />
          <path d="M20 50 L15 50" />
          <path d="M80 50 L85 50" />
        </svg>
      ),
      color: 'from-pink-400 to-pink-600',
  activities: ['E-bike Design', 'Battery Systems', 'Motor Control']
    }
  ];

  const achievements = [
    {
      team: 'XLR8 Racing',
      title: 'Formula SAE India 2024',
      position: '3rd Place Overall',
      year: '2024',
      icon: (
        <svg width="32" height="32" viewBox="0 0 100 100" className="stroke-yellow-400 fill-none stroke-2">
          <circle cx="50" cy="60" r="25" />
          <path d="M35 45 L50 25 L65 45" />
          <path d="M40 40 L60 40" />
          <circle cx="50" cy="30" r="3" className="fill-yellow-400" />
          <rect x="45" y="85" width="10" height="15" />
        </svg>
      )
    },
    {
      team: 'HBAJA',
      title: 'BAJA SAE India 2024',
      position: '1st Place Design',
      year: '2024',
      icon: (
        <svg width="32" height="32" viewBox="0 0 100 100" className="stroke-yellow-400 fill-none stroke-2">
          <circle cx="50" cy="50" r="30" />
          <path d="M35 40 L50 25 L65 40 L50 55 Z" className="fill-yellow-400 stroke-none" />
          <text x="50" y="58" className="fill-yellow-400 text-xs font-bold text-center" textAnchor="middle">1</text>
        </svg>
      )
    },
    {
      team: 'VEGHA',
      title: 'Shell Eco-Marathon',
      position: '2nd Place Efficiency',
      year: '2024',
      icon: (
        <svg width="32" height="32" viewBox="0 0 100 100" className="stroke-green-400 fill-none stroke-2">
          <path d="M50 15 L35 30 L20 45 L35 60 L50 75 L65 60 L80 45 L65 30 Z" />
          <path d="M50 25 L42 35 L50 45 L58 35 Z" className="fill-green-400 stroke-none" />
          <path d="M50 45 L42 55 L50 65 L58 55 Z" />
        </svg>
      )
    },
    {
      team: 'XLR8 E-racing',
      title: 'Formula Student Electric',
      position: '5th Place Overall',
      year: '2023',
      icon: (
        <svg width="32" height="32" viewBox="0 0 80 100" className="stroke-yellow-400 fill-none stroke-2">
          <path d="M30 10 L50 10 L35 40 L55 40 L25 90 L45 60 L25 60 L30 10 Z" className="fill-yellow-400 stroke-none" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen">

      <section className="relative bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
    
        <div className="absolute inset-0 bg-gray-900"></div>
        
       
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url('/images/ceiling-grid.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
      
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

   
        <div className="absolute inset-0 bg-black/50"></div>

       
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)`,
            backgroundSize: '800px 800px, 600px 600px, 700px 700px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex-1 flex items-center justify-center">
          <div className="max-w-6xl mx-auto text-center w-full">
            
           
            <div className="flex flex-col justify-center items-center h-full py-8 sm:py-12 md:py-16">
              
              <div className="mb-4 sm:mb-6 md:mb-8">
                <span className="bg-blue-600 text-white px-5 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-xs tracking-wider font-bold uppercase">
                  SAE TKMCE
                </span>
              </div>

              
              <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-8 relative hero-title">
                <h1 className="text-6xl sm:text-4xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight leading-[0.8] sm:leading-[0.9] md:leading-[0.85] lg:leading-[0.8] text-white hero-title" style={{fontFamily: 'Almarai, sans-serif'}}>
                  <span className="block">GREASE</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                    MUD
                  </span>
                  <span className="block text-gray-300">GLORY</span>
                </h1>
              </div>
            </div>

            <div className="absolute bottom-36 sm:bottom-32 md:bottom-80 lg:bottom-24 xl:bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <img 
            src="/images/formula-car.png" 
            alt="Formula Racing Car"
            className="w-auto h-32 scale-150 sm:h-40 md:h-56 lg:h-48 xl:h-52 2xl:h-56 sm:scale-150 md:scale-175 lg:scale-150 xl:scale-140 object-contain opacity-75 sm:opacity-85 md:opacity-90 lg:opacity-95"
            style={{
              filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.6)) drop-shadow(0 0 15px rgba(59,130,246,0.4))'
            }}
          />
        </div>
            <div className="absolute sm:relative bottom-4 sm:bottom-[-3rem]  left-4 right-4 sm:left-auto sm:right-auto hero-buttons" style={{ zIndex: 9999 }}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center items-center">
                <button
                  onClick={handleRegistrationClick}
                  className="group relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white px-8 sm:px-4 md:px-5 py-3 sm:py-1.5 rounded-none font-bold text-sm sm:text-xs uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 w-full sm:w-auto cursor-pointer"
                  style={{ zIndex: 9999, position: 'relative' }}
                >
                  <span className="relative flex items-center justify-center gap-1 sm:gap-1 pointer-events-none">
                    <span>Join the Crew</span>
                    <svg className="w-4 h-4 sm:w-2.5 sm:h-2.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5-5 5M6 12h12"></path>
                    </svg>
                  </span>
                </button>
                <Link
                  to="/events"
                  className="group relative border-2 border-blue-500 text-blue-400 px-8 sm:px-4 md:px-5 py-3 sm:py-1.5 rounded-none font-bold text-sm sm:text-xs uppercase tracking-wide hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto cursor-pointer"
                  style={{ zIndex: 9999, position: 'relative' }}
                >
                  <span className="relative flex items-center justify-center gap-1 sm:gap-1 group-hover:text-white transition-colors duration-300 pointer-events-none">
                    <svg className="w-4 h-4 sm:w-2.5 sm:h-2.5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"></path>
                    </svg>
                    <span>See Our Machines</span>
                  </span>
                </Link>
              </div>
              
              {/* Subtitle - Now at the bottom on non-mobile devices */}
              <div className="hidden sm:block max-w-4xl mx-auto mt-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium text-center">
                  Society of Automotive Engineers • TKM College of Engineering
                </p>
              </div>
              
              {/* Mobile subtitle - visible on mobile devices */}
              <div className="block sm:hidden max-w-4xl mx-auto mt-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium text-center">
                  Society of Automotive Engineers • TKM College of Engineering
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements - racing themed */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-500 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-600 rounded-full opacity-40 animate-pulse" style={{animationDelay: '3s'}}></div>
        
        {/* Additional atmospheric lighting */}
        <div className="absolute top-10 left-10 w-1 h-20 bg-gradient-to-b from-blue-500/20 to-transparent transform rotate-12"></div>
        <div className="absolute top-20 right-16 w-1 h-16 bg-gradient-to-b from-cyan-500/20 to-transparent transform -rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-1 h-24 bg-gradient-to-b from-blue-400/20 to-transparent transform rotate-45"></div>
        
        {/* Race car image - positioned just above buttons across all devices */}
        
      </section>

      {/* Teams Hub Section - Circular Layout */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative min-h-screen flex items-center">
        {/* Light Checkered Background Pattern */}
        <div className="absolute inset-0 opacity-60">
          <div className="w-full h-full" style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 40px,
                rgba(59, 130, 246, 0.1) 40px,
                rgba(59, 130, 246, 0.1) 41px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                rgba(59, 130, 246, 0.1) 40px,
                rgba(59, 130, 246, 0.1) 41px
              )
            `
          }}></div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
              Our Teams
            </h2>
          </div>
          
          {/* Desktop and Tablet Circular Layout */}
          <div className="hidden sm:block">
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="relative aspect-square max-w-2xl mx-auto">
                
                {/* Central SAE Logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 bg-white rounded-full shadow-2xl border-4 border-blue-600 flex items-center justify-center hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-blue-600 font-black text-2xl sm:text-3xl lg:text-4xl tracking-wider mb-1">
                        SAE
                      </div>
                      <div className="text-gray-700 text-xs sm:text-sm font-bold">
                        TKMCE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Logos - Positioned in Circle */}
                {teams.map((team, index) => {
                  const angle = (index * 51.43) - 90; // 360/7 = 51.43 degrees apart, start from top
                  const radius = window.innerWidth < 768 ? 140 : 160; // Smaller radius on smaller screens
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  
                  return (
                    <div key={index} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                         style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
                      
                      {/* Team Logo Circle */}
                      <div className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br ${team.color} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center group`}>
                        <div className="text-white scale-75 sm:scale-85 lg:scale-90 group-hover:scale-100 transition-transform duration-300">
                          {team.icon}
                        </div>
                        
                        {/* Team Name on Hover */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {team.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Layout - Vertical Stack */}
          <div className="block sm:hidden">
            <div className="flex flex-col items-center space-y-6">
              
              {/* Central SAE Logo - Mobile */}
              <div className="w-24 h-24 bg-white rounded-full shadow-2xl border-4 border-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-blue-600 font-black text-xl tracking-wider mb-0.5">
                    SAE
                  </div>
                  <div className="text-gray-700 text-xs font-bold">
                    TKMCE
                  </div>
                </div>
              </div>

              {/* Team Logos Grid - Mobile */}
              <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                {teams.slice(0, 6).map((team, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${team.color} rounded-full shadow-lg flex items-center justify-center mb-2`}>
                      <div className="text-white scale-75">
                        {team.icon}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">
                      {team.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* 7th Team - Centered below */}
              {teams.length > 6 && (
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${teams[6].color} rounded-full shadow-lg flex items-center justify-center mb-2`}>
                    <div className="text-white scale-75">
                      {teams[6].icon}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {teams[6].name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Achievements</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Excellence in competition drives our passion for innovation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">{achievement.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-yellow-400">{achievement.team}</h3>
                  <p className="text-sm text-gray-300 mb-2">{achievement.title}</p>
                  <p className="text-lg font-semibold text-green-400">{achievement.position}</p>
                  <p className="text-xs text-gray-400">{achievement.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join us in our upcoming events and competitions
            </p>
          </div>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  data-aos="fade-up"
                >
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                    {event.image_url || event.image ? (
                      <img
                        src={event.image_url || event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎉</div>
                          <p className="text-sm opacity-80">Event Image</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {event.event_type}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                    
                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="w-5">📍</span>
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="w-5">⏰</span>
                        <span>{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      {event.host && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="w-5">�</span>
                          <span>Host: {event.host}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {user?.membership_status === 'approved' ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 line-through">₹{event.registration_fee}</span>
                            <span className="text-green-600 font-semibold">₹{event.member_fee}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Member Price</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-700 font-medium">₹{event.registration_fee}</span>
                            {event.member_fee < event.registration_fee && (
                              <span className="text-xs text-blue-600">₹{event.member_fee} for members</span>
                            )}
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-300"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
              <p className="text-gray-600 mb-6">Check back soon for exciting new events and competitions!</p>
              <Link
                to="/events"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                View All Events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Join SAE TKMCE?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Become part of India's leading automotive engineering student organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6" data-aos="fade-up">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn by Doing</h3>
              <p className="text-gray-600">
                Hands-on experience with real automotive projects and cutting-edge technology
              </p>
            </div>
            
            <div className="text-center p-6" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compete Globally</h3>
              <p className="text-gray-600">
                Participate in international competitions and showcase your skills on the world stage
              </p>
            </div>
            
            <div className="text-center p-6" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Networks</h3>
              <p className="text-gray-600">
                Connect with industry professionals, alumni, and fellow automotive enthusiasts
              </p>
            </div>
            
            <div className="text-center p-6" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovate</h3>
              <p className="text-gray-600">
                Work on groundbreaking projects in electric vehicles, autonomous systems, and more
              </p>
            </div>
            
            <div className="text-center p-6" data-aos="fade-up" data-aos-delay="400">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Launch Career</h3>
              <p className="text-gray-600">
                Gain valuable experience and skills that will accelerate your automotive engineering career
              </p>
            </div>
            
            <div className="text-center p-6" data-aos="fade-up" data-aos-delay="500">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Make Impact</h3>
              <p className="text-gray-600">
                Contribute to sustainable transportation solutions and shape the future of mobility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Rev Up Your Future?</h2>
          <p className="text-xl mb-8">
            Join SAE TKMCE and be part of the automotive revolution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRegistrationClick}
              onMouseDown={handleRegistrationClick}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
              style={{ zIndex: 50 }}
            >
              Join the Crew
            </button>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
