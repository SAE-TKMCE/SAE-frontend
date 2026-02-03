import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContextMock';


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setShowNavbar(true);
      } else {
        // Hide navbar when scrolling down
        setShowNavbar(false);
      }
      
      // Change navbar background when scrolled
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (path) => {
  setIsMenuOpen(false);
  navigate(path);
};

useEffect(() => {
  const closeMenu = (e) => {
    // Close menu if clicking outside of menu and menu button
    if (isMenuOpen && 
        !e.target.closest('.mobile-menu') && 
        !e.target.closest('.menu-button')) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener('click', closeMenu);
  return () => document.removeEventListener('click', closeMenu);
}, [isMenuOpen]);
  return (
    
    
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      showNavbar ? 'translate-y-0' : '-translate-y-full'
    } ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={isScrolled ? '/logo.png' : '/SAE.png'}
                alt="SAE TKMCE"
                className="h-8 w-auto object-contain transition-opacity duration-300"
                height={32}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/SAE.png';
                }}
              />
            </Link>
          </div>
            
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-blue-600' 
                : 'text-white hover:text-blue-400'
            }`}>
              Home
            </Link>
            <Link to="/teams" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-blue-600' 
                : 'text-white hover:text-blue-400'
            }`}>
              Teams
            </Link>
            <Link to="/events" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-blue-600' 
                : 'text-white hover:text-blue-400'
            }`}>
              Events
            </Link>
            <Link to="/achievements" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-blue-600' 
                : 'text-white hover:text-blue-400'
            }`}>
              Achievements
            </Link>
            <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:text-blue-600' 
                : 'text-white hover:text-blue-400'
            }`}>
              About
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-400'
                }`}>
                  Dashboard
                </Link>
                <Link to="/profile" className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-blue-400'
                }`}>
                  Profile
                </Link>
                {/* Temporarily show admin for all users for testing */}
                <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium border transition duration-300 ${
                  isScrolled
                    ? 'text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700'
                    : 'text-blue-400 hover:text-blue-300 border-blue-400 hover:border-blue-300'
                }`}>
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                    isScrolled
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white hover:text-blue-400'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                    isScrolled
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Join Web Team
                </Link>
                
              </div>
              
            )}
          </div>
          </div>
        </div>

          {/* Mobile menu button */}
          <div className="absolute top-1 right-4 z-[100] md:hidden flex items-center">
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="w-10 h-5 relative focus:outline-none menu-button p-4"
              aria-label="Menu"
              style={{ minWidth: 48, minHeight: 48 }}
            >
              <span className={`absolute left-2 w-6 h-0.5 transform transition-all duration-300 ${
                isScrolled ? 'bg-gray-600' : 'bg-white'
              } ${
                isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'
              }`} />
              <span className={`absolute left-2 w-6 h-0.5 transform transition-all duration-300 ${
                isScrolled ? 'bg-gray-600' : 'bg-white'
              } ${
                isMenuOpen ? 'opacity-0' : 'translate-y-3'
              }`} />
              <span className={`absolute left-2 w-6 h-0.5 transform transition-all duration-300 ${
                isScrolled ? 'bg-gray-600' : 'bg-white'
              } ${
                isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-5'
              }`} />
            </button>
          </div>
      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed inset-0 transition-all duration-300 transform mobile-menu flex flex-col items-center justify-center bg-black z-[99] ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ fontFamily: 'Roboto, Arial, sans-serif', background: 'black', minHeight: '100vh', minWidth: '100vw' }}
      >
        <div className="w-full h-full px-6 py-10 space-y-4 flex flex-col items-center justify-center">
          <button onClick={() => handleNavClick('/')} 
            className="w-full text-center text-white hover:text-blue-400 px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
            Home
          </button>
          <button onClick={() => handleNavClick('/teams')} 
            className="w-full text-center text-white hover:text-blue-400 px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
            Teams
          </button>
          <button onClick={() => handleNavClick('/events')} 
            className="w-full text-center text-white hover:text-blue-400 px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
            Events
          </button>
          <button onClick={() => handleNavClick('/achievements')} 
            className="w-full text-center text-white hover:text-blue-400 px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
            Achievements
          </button>
          <button onClick={() => handleNavClick('/about')} 
            className="w-full text-center text-white hover:text-blue-400 px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
            About
          </button>
          {user ? (
            <>
              <button onClick={() => handleNavClick('/dashboard')} 
                className="w-full text-center text-white hover:text-blue-400 px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
                Dashboard
              </button>
              <button onClick={() => handleNavClick('/profile')} 
                className="w-full text-center text-white hover:text-blue-400 px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
                Profile
              </button>
              <button onClick={() => handleNavClick('/admin')}
                className="w-full text-center text-blue-400 hover:text-blue-300 px-6 py-4 rounded-lg text-xl font-medium border border-blue-400 hover:border-blue-300 transition duration-300">
                Admin Dashboard
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg text-xl font-medium transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNavClick('/login')}
                className="w-full text-center text-white hover:text-blue-400 px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
                Login
              </button>
              <button onClick={() => handleNavClick('/register')}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg text-xl font-medium transition duration-300">
                Join Web Team 2026
              </button>
            </>
          )}
        </div>
      </div>
</nav>
  );
};
export default Navbar;
