
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { eventsService } from '../services/events';
import TeamHighlightsCarousel from '../components/TeamHighlightsCarousel';
import UpcomingEventsCarousel from '../components/UpcomingEventsCarousel';


const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselBgOpacity, setCarouselBgOpacity] = useState(1);
  const [carouselFontColor, setCarouselFontColor] = useState('#111827'); // Start with gray-900
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [teamPositions, setTeamPositions] = useState([]);
  const carouselSectionRef = useRef(null);

  useEffect(() => {
    // Fetch events
    setLoading(true);
    eventsService.getEvents()
      .then((events) => {
        setUpcomingEvents(events);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Scroll-based background transition for carousel section
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselSectionRef.current) return;
      const section = carouselSectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Calculate progress through the section
      let progress = 0;
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Section is in viewport
        // Accelerate the transition so gray-900 fills by halfway through the section
        let rawProgress = (windowHeight - rect.top) / (rect.height + windowHeight);
        let adjustedProgress = Math.min(1, Math.max(0, rawProgress * 2)); // x2: fill by halfway
        progress = adjustedProgress;
      } else if (rect.top >= windowHeight) {
        // Before section
        progress = 0;
      } else {
        // After section
        progress = 0;
      }
  setCarouselBgOpacity(progress);
  // Interpolate font color from dark to white
  const r = Math.round(17 * progress + 255 * (1 - progress));
  const g = Math.round(24 * progress + 255 * (1 - progress));
  const b = Math.round(39 * progress + 255 * (1 - progress));
  // If progress > 0.5, switch to white font, else dark
  const fontColor = progress > 0.5 ? '#fff' : `rgb(${r},${g},${b})`;
  setCarouselFontColor(fontColor);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
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
         <img 
          src="/images/teams/veghalogo.png" 
          alt="VEGHA" 
        />
      ),
    },
    {
      name: 'DRONA',
      description: 'Drona SAE Team',
      icon: (
        <img 
          src="/images/teams/DRONA_LW.png" 
          alt="DRONA" 
        />
      ),
    },
    {
      name: 'XLR8 Racing',
      description: 'Formula SAE Racing Team',
      icon: (
        <img 
          src="/images/teams/xlr8-racing.png" 
          alt="XLR8 Racing" 
        />
      ),
    },
    {
      name: 'XLR8FST',
      description: 'Formula Student Racing Team',
      icon: (<img 
          src="/images/teams/xlr8-fst.png" 
          alt="XLR8FST" 
        />
        
      ),
    },
    {
      name: 'Aerex',
      description: 'Fixed Wing UAV Team',
      icon: (
        <img 
          src="/images/teams/Aerex-logo.png" 
          alt="Aerex" 
        />
      ),
    },
    {
      name: 'SPOX',
  description: 'Electric Bicycle Design Team',
      icon: (
        <img 
          src="/images/teams/SPOX-LOGO.png" 
          alt="SPOX" 
        />
      ),
    }
  ];

  const achievements = [
    {
      team: 'MOBILE APP DEVELOPMENT',
      title: 'SAEINDIA SOUTHERN SECTION STUDENT CONVENTION',
      position: '1st Place',
      year: '2025',
      image: '/images/achievements/mobileappdevelopment.jpg',
      icon: (
        <svg width="32" height="32" viewBox="0 0 80 100" className="stroke-yellow-400 fill-none stroke-2">
          <path d="M30 10 L50 10 L35 40 L55 40 L25 90 L45 60 L25 60 L30 10 Z" className="fill-yellow-400 stroke-none" />
        </svg>
      )
    },

    
    {
      team: 'VEGHA',
      title: 'TWO Wheeler Design Competition',
      position: 'AIR 2',
      year: '2025',
      image: '/images/achievements/twowheeler.jpg',
      icon: (
        <svg width="32" height="32" viewBox="0 0 100 100" className="stroke-yellow-400 fill-none stroke-2">
          <circle cx="50" cy="50" r="30" />
          <path d="M35 40 L50 25 L65 40 L50 55 Z" className="fill-yellow-400 stroke-none" />
          <text x="50" y="58" className="fill-yellow-400 text-xs font-bold text-center" textAnchor="middle">1</text>
        </svg>
      )
    },
    {
      team: 'HBAJA',
      title: 'Design Event',
      position: 'AIR 5',
      year: '2025',
      image: '/images/achievements/designair.jpg',
      icon: (
        <svg width="32" height="32" viewBox="0 0 100 100" className="stroke-green-400 fill-none stroke-2">
          <path d="M50 15 L35 30 L20 45 L35 60 L50 75 L65 60 L80 45 L65 30 Z" />
          <path d="M50 25 L42 35 L50 45 L58 35 Z" className="fill-green-400 stroke-none" />
          <path d="M50 45 L42 55 L50 65 L58 55 Z" />
        </svg>
      )
    },
    {
      team: 'XLR8 Racing',
      title: 'SAE HBAJA 2025',
      position: 'AIR 12 | KERALA 3',
      year: '2025',
      image: '/images/achievements/xlr8racing.jpg',
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
    
  ];

  
  const achievementDetails = {
    'MOBILE APP DEVELOPMENT': {
      members: [],
      prize: '',
      expense: '',
    },
    'HBAJA': {
      members: [],
      prize: '',
      expense: '',
    },
    'VEGHA': {
      members: [],
      prize: '',
      expense: '',
    },
    'XLR8 Racing': {
      members: [],
      prize: '',
      expense: '',
    },
  };

  // Vanta effect removed; background video is now used for achievements section

  useEffect(() => {
    // Initial positions
    setTeamPositions(Array.from({ length: teams.length }, (_, i) => i));
    // Interval to shuffle positions
    const interval = setInterval(() => {
      setTeamPositions(prev => {
        // Fisher-Yates shuffle
        const arr = [...prev];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      });
    }, 2000); // Swap every 2 seconds
    return () => clearInterval(interval);
  }, [teams.length]);

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
            className="w-auto h-32 scale-150 sm:h-40 md:h-56 lg:h-48 xl:h-52 2xl:h-56 sm:scale-150 md:scale-175 lg:scale-150 xl:scale-140 object-contain opacity-75 sm:opacity-85 md:opacity-90 lg:opacity-95 hero-car-img"
            style={{
              filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.6)) drop-shadow(0 0 15px rgba(59,130,246,0.4))'
            }}
          />
        </div>
        <style>{`
          @media only screen and (max-width: 600px) and (min-height: 900px) {
            .hero-car-img {
              height: 220px !important;
              scale: 1.85 !important;
              opacity: 0.95 !important;
            }
          }
        `}</style>
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
          
          {/* Desktop and Tablet Circular Layout - now always visible */}
          <div className="block">
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="relative aspect-square max-w-2xl mx-auto">
                
                {/* Central SAE Logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-transparent rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-blue-600 font-black text-2xl sm:text-3xl lg:text-4xl tracking-wider mb-1">
                        <img
                          src="/logo.png"
                          alt="SAE TKMCE Logo"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Logos - Positioned in Circle with animated swap */}
                {teamPositions.map((teamIdx, index) => {
                  const angle = (index * 60) - 90; // 360/6 = 60 degrees apart, start from top
                  const radius = window.innerWidth < 500 ? 120 : window.innerWidth < 768 ? 140 : 160;
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  const team = teams[teamIdx];
                  return (
                    <div
                      key={teamIdx}
                      className="absolute top-1/2 left-1/2 team-logo-anim"
                      style={{
                        transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        zIndex: 10,
                      }}
                    >
                      {/* Team Logo Circle */}
                      <div className={`w-20 h-20 sm:w-20 sm:h-20 lg:w-20 lg:h-20  ${team.color} hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center group`}>
                        <div className="text-white scale-90 sm:scale-90 lg:scale-90 group-hover:scale-100 transition-transform duration-300">
                          {team.icon}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Highlights Carousel */}
      <section ref={carouselSectionRef} className="py-8 bg-white relative">
        {/* Fading gray-900 background layer */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundColor: `rgb(
              ${Math.round(255 * (1 - carouselBgOpacity) + 17 * carouselBgOpacity)},
              ${Math.round(255 * (1 - carouselBgOpacity) + 24 * carouselBgOpacity)},
              ${Math.round(255 * (1 - carouselBgOpacity) + 39 * carouselBgOpacity)}
            )`,
            transition: 'background-color 0.4s',
          }}
        ></div>
        {/* Light Checkered Background Pattern */}
        <div className="absolute inset-0 opacity-60 pointer-events-none z-0">
          <div className="w-full h-full" style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 40px,
                rgba(59, 130, 246, 0.08) 40px,
                rgba(59, 130, 246, 0.08) 41px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                rgba(59, 130, 246, 0.08) 40px,
                rgba(59, 130, 246, 0.08) 41px
              )
            `
          }}></div>
        </div>
        
        <div
          className="w-full max-w-full lg:max-w-2xl xl:max-w-sm mx-auto px-0 relative z-10"
          style={{ color: carouselFontColor, transition: 'color 0.4s' }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 pt-56">Team Highlights</h2>
          <div
            style={{ borderRadius: 12, overflow: 'hidden', width: '100%', maxWidth: '100vw', margin: '0 auto', paddingBottom: '45.25%' }}
            className="w-full h-auto lg:aspect-[9/16]"
          >
            <TeamHighlightsCarousel />
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
        {/* Background video for achievements section */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/videos/achievement-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ minHeight: '100%', minWidth: '100%' }}
        ></video>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>
        <div className="relative z-20">
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
                  className="relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage: `url(${achievement.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 p-6 w-full text-center">
                    
                    
                  </div>
                  <div className="absolute bottom-3 right-3 z-20">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Modal for expanded achievement */}
          {selectedAchievement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500" onClick={() => setSelectedAchievement(null)}>
              <div
                className="relative bg-white/90 rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 flex flex-col items-center"
                style={{
                  backgroundImage: `url(/images/achievements/${selectedAchievement.team.replace(/\s+/g, '').toLowerCase()}.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(8px)',
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  opacity: 0.3,
                }}
              ></div>
              <div className="relative z-10 bg-black/70 rounded-2xl p-8 max-w-lg w-full mx-4 flex flex-col items-center text-white transition-all duration-500 transform scale-95 opacity-0 animate-modalIn">
                <button className="absolute top-4 right-4 text-white text-2xl" onClick={e => {e.stopPropagation(); setSelectedAchievement(null);}}>&times;</button>
                <h2 className="text-2xl font-bold mb-2 text-yellow-400">{selectedAchievement.team}</h2>
                <h3 className="text-lg font-semibold mb-2">{selectedAchievement.title}</h3>
                <p className="text-lg mb-4">{selectedAchievement.position}</p>
                <div className="mb-2">
                  <span className="font-bold">Team Members:</span>
                  <ul className="list-disc list-inside">
                    {(achievementDetails[selectedAchievement.team]?.members || []).map((member, i) => (
                      <li key={i}>{member}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <span className="font-bold">Prize:</span> {achievementDetails[selectedAchievement.team]?.prize}
                </div>
                <div className="mb-2">
                  <span className="font-bold">Project Expense:</span> {achievementDetails[selectedAchievement.team]?.expense}
                </div>
              </div>
              <style>{`
                @keyframes modalIn {
                  0% { opacity: 0; transform: scale(0.8); }
                  100% { opacity: 1; transform: scale(1); }
                }
                .animate-modalIn {
                  animation: modalIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
                }
              `}</style>
            </div>
          )}
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
            <UpcomingEventsCarousel events={upcomingEvents} />
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
