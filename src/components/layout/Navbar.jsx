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
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className={`text-2xl font-bold font-mono transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>SAE TKMCE</span>
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
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`focus:outline-none transition duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-blue-400'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 border-t border-blue-500">
            <Link to="/" className="block text-white hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition duration-300">
              Home
            </Link>
            <Link to="/teams" className="block text-white hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition duration-300">
              Teams
            </Link>
            <Link to="/events" className="block text-white hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition duration-300">
              Events
            </Link>
            <Link to="/achievements" className="block text-white hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition duration-300">
              Achievements
            </Link>
            <Link to="/about" className="block text-white hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition duration-300">
              About
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="block text-white hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition duration-300">
                  Profile
                </Link>
                {/* Temporarily show admin for all users for testing */}
                <Link to="/admin" className="block text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-base font-medium border border-blue-400 hover:border-blue-300 transition duration-300">
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-white hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition duration-300">
                  Login
                </Link>
                <Link to="/register" className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium transition duration-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
