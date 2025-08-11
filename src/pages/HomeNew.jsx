import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsService } from '../services/events';

const Home = () => {
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

  const teams = [
    {
      name: 'VEGHA',
      description: 'Vehicle Engineering & Green Hybrid Automotive',
      icon: '🚗',
      color: 'from-green-400 to-green-600',
      activities: ['Hybrid Vehicle Design', 'Fuel Efficiency', 'Green Technology']
    },
    {
      name: 'HBAJA',
      description: 'Heavy Baja SAE Team',
      icon: '🏎️',
      color: 'from-red-400 to-red-600',
      activities: ['All-Terrain Vehicle', 'Off-Road Racing', 'Suspension Design']
    },
    {
      name: 'MBAJA',
      description: 'Mini Baja SAE Team',
      icon: '🏁',
      color: 'from-orange-400 to-orange-600',
      activities: ['Mini Baja Competition', 'Vehicle Dynamics', 'Frame Design']
    },
    {
      name: 'XLR8 Racing',
      description: 'Formula SAE Racing Team',
      icon: '🏎️',
      color: 'from-blue-400 to-blue-600',
      activities: ['Formula Racing', 'Performance Tuning', 'Aerodynamics']
    },
    {
      name: 'XLR8FST',
      description: 'Formula Student Racing Team',
      icon: '🏆',
      color: 'from-purple-400 to-purple-600',
      activities: ['Formula Student', 'International Competition', 'Innovation']
    },
    {
      name: 'XLR8 E-racing',
      description: 'Electric Racing Team',
      icon: '⚡',
      color: 'from-yellow-400 to-yellow-600',
      activities: ['Electric Vehicles', 'Battery Technology', 'Sustainability']
    },
    {
      name: 'SPOX',
  description: 'Electric Bicycle Design Team',
      icon: '🎯',
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
      icon: '🏆'
    },
    {
      team: 'HBAJA',
      title: 'BAJA SAE India 2024',
      position: '1st Place Design',
      year: '2024',
      icon: '🥇'
    },
    {
      team: 'VEGHA',
      title: 'Shell Eco-Marathon',
      position: '2nd Place Efficiency',
      year: '2024',
      icon: '🌿'
    },
    {
      team: 'XLR8 E-racing',
      title: 'Formula Student Electric',
      position: '5th Place Overall',
      year: '2023',
      icon: '⚡'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen flex items-center overflow-hidden">
        {/* Automotive Graphics Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl transform rotate-12">🏎️</div>
          <div className="absolute top-20 right-20 text-6xl transform -rotate-12">⚡</div>
          <div className="absolute bottom-32 left-20 text-7xl transform rotate-45">🛵</div>
          <div className="absolute bottom-20 right-32 text-5xl transform -rotate-45">🏁</div>
          <div className="absolute top-1/3 left-1/4 text-6xl transform rotate-90">🚗</div>
          <div className="absolute top-1/2 right-1/3 text-7xl transform -rotate-90">🛸</div>
          <div className="absolute bottom-1/3 left-1/3 text-5xl transform rotate-12">✈️</div>
          <div className="absolute top-1/4 right-1/4 text-6xl transform -rotate-12">🚲</div>
          <div className="absolute bottom-1/4 right-1/5 text-8xl transform rotate-45">🏎️</div>
        </div>

        {/* Grease and Oil Texture Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-red-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            {/* Main Hero Message */}
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-wider leading-none"
              style={{
                fontFamily: "'Courier New', 'Lucida Console', monospace",
                textShadow: "4px 4px 0px #ff6600, 8px 8px 0px rgba(0,0,0,0.3)",
                background: "linear-gradient(45deg, #ff6600, #ffaa00, #ff3300)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent"
              }}
            >
              GREASE
            </h1>
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-wider leading-none"
              style={{
                fontFamily: "'Courier New', 'Lucida Console', monospace",
                textShadow: "4px 4px 0px #8B4513, 8px 8px 0px rgba(0,0,0,0.3)",
                background: "linear-gradient(45deg, #8B4513, #A0522D, #654321)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent"
              }}
            >
              MUD
            </h1>
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 tracking-wider leading-none"
              style={{
                fontFamily: "'Courier New', 'Lucida Console', monospace",
                textShadow: "4px 4px 0px #FFD700, 8px 8px 0px rgba(0,0,0,0.3)",
                background: "linear-gradient(45deg, #FFD700, #FFA500, #FF8C00)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent"
              }}
            >
              GLORY
            </h1>
            
            <div className="flex justify-center items-center gap-8 mb-8 text-4xl animate-bounce">
              <span className="text-orange-500">🏎️</span>
              <span className="text-yellow-500">⚡</span>
              <span className="text-blue-500">🛵</span>
              <span className="text-green-500">🚲</span>
              <span className="text-purple-500">🛸</span>
              <span className="text-red-500">✈️</span>
            </div>
            
            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto font-bold text-orange-300">
              Society of Automotive Engineers - TKM College of Engineering
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-300 font-mono">
              Where Passion Meets Performance • Innovation Drives Excellence
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-700 transition duration-300 transform hover:scale-105 shadow-lg font-mono"
              >
                🏎️ JOIN THE TEAM
              </Link>
              <Link
                to="/events"
                className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition duration-300 transform hover:scale-105 font-mono"
              >
                ⚡ VIEW EVENTS
              </Link>
            </div>
        </div>
      </section>

      {/* Teams Showcase Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Teams
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Seven specialized teams working together to push the boundaries of automotive engineering
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map((team, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${team.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{team.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{team.description}</p>
                  <div className="space-y-1">
                    {team.activities.map((activity, idx) => (
                      <div key={idx} className="text-xs bg-white/20 rounded-full px-2 py-1">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
                  <div className="text-3xl mb-4">{achievement.icon}</div>
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
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {event.event_type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">📍 {event.venue}</span>
                    <Link
                      to={`/events/${event.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-300"
                    >
                      Learn More
                    </Link>
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
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Become a Member
            </Link>
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
