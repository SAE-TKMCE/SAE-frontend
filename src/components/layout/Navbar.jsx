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

  const handleMenuToggle = () => {
    setIsMenuOpen(prevState => !prevState);
  };
  
  return (
  <>
      {/* Main Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Main navbar content */}
            <div className="flex justify-between items-center h-16">
              {/* Logo Section - Centered on mobile, left-aligned on desktop */}
              <div className="flex items-center flex-1 md:flex-none justify-center md:justify-start">
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
        </div>
      </div>
    </div>
    </nav>

    {/* Hamburger Menu Button - Completely Outside Nav */}
    <div 
      className={`fixed top-0 right-4 z-[60] md:hidden transition-all duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="h-16 flex items-center">
        <div
          id="mobile-menu-button"
          onClick={handleMenuToggle}
          className="menu-button inline-flex items-center justify-center p-2 rounded-md focus:outline-none cursor-pointer transition-colors duration-200 hover:bg-white/10"
          role="button"
          tabIndex={0}
          aria-label="Main menu"
          aria-expanded={isMenuOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMenuToggle();
            }
          }}
        >
          <span className="sr-only">Open main menu</span>
          <div className="w-6 h-6 relative pointer-events-none">
            <span className={`absolute left-0 w-6 h-0.5 transform transition-all duration-300 ease-in-out ${
              isScrolled ? 'bg-gray-600' : 'bg-white'
            } ${
              isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'
            }`} />
            <span className={`absolute left-0 w-6 h-0.5 transform transition-all duration-300 ease-in-out ${
              isScrolled ? 'bg-gray-600' : 'bg-white'
            } ${
              isMenuOpen ? 'opacity-0' : 'translate-y-3'
            }`} />
            <span className={`absolute left-0 w-6 h-0.5 transform transition-all duration-300 ease-in-out ${
              isScrolled ? 'bg-gray-600' : 'bg-white'
            } ${
              isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-5'
            }`} />
          </div>
        </div>
      </div>
    </div>

    {/* Mobile menu - Also outside nav */}
    <div 
      className={`md:hidden fixed inset-x-0 top-16 z-[55] transition-all duration-300 transform mobile-menu ${
        isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="px-2 pt-2 pb-3 sm:px-3 bg-black/90 backdrop-blur-sm border-t border-blue-500">
        <div className="space-y-0">
          <button onClick={() => handleNavClick('/')} 
            className="w-full text-center text-white hover:text-blue-400 px-3 py-3 text-base font-medium transition duration-300 border-b border-white/20 hover:border-white/40">
            Home
          </button>
          <button onClick={() => handleNavClick('/teams')} 
            className="w-full text-center text-white hover:text-blue-400 px-3 py-3 text-base font-medium transition duration-300 border-b border-white/20 hover:border-white/40">
            Teams
          </button>
          <button onClick={() => handleNavClick('/events')} 
            className="w-full text-center text-white hover:text-blue-400 px-3 py-3 text-base font-medium transition duration-300 border-b border-white/20 hover:border-white/40">
            Events
          </button>
          <button onClick={() => handleNavClick('/achievements')} 
            className="w-full text-center text-white hover:text-blue-400 px-3 py-3 text-base font-medium transition duration-300 border-b border-white/20 hover:border-white/40">
            Achievements
          </button>
          <button onClick={() => handleNavClick('/about')} 
            className="w-full text-center text-white hover:text-blue-400 px-3 py-3 text-base font-medium transition duration-300 border-b border-white/20 hover:border-white/40">
            About
          </button>
        </div>
        
        {user ? (
          <>
            {/* Separator line for user section */}
            <div className="border-t border-white/40 my-3"></div>
            <div className="space-y-0">
              <button onClick={() => handleNavClick('/profile')} 
                className="w-full text-center text-white hover:text-blue-400 px-3 py-3 text-base font-medium transition duration-300 border-b border-white/20 hover:border-white/40">
                Profile
              </button>
              <button onClick={() => handleNavClick('/admin')}
                className="w-full text-center text-blue-400 hover:text-blue-300 px-3 py-3 text-base font-medium border-b border-white/20 hover:border-white/40 transition duration-300">
                Admin Dashboard
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-3 text-base font-medium transition duration-300"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Separator line for auth section */}
            <div className="border-t border-white/40 my-3"></div>
            <div className="space-y-0">
              <button onClick={() => handleNavClick('/login')}
                className="w-full text-center text-white hover:text-blue-400 px-3 py-3 text-base font-medium transition duration-300 border-b border-white/20 hover:border-white/40">
                Login
              </button>
              <button onClick={() => handleNavClick('/register')}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-3 text-base font-medium transition duration-300">
                Register
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};
export default Navbar;
