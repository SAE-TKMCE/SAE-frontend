import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import googleSheetsRegistrationService from '../services/googleSheetsRegistration';

// Add custom styles for the grid animation
const styles = `
  @keyframes gridMove {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100px 100px;
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    college_id: '',
    year_of_study: '',
    branch: '',
    preferred_team: '',
    interests: '',
    experience: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const result = await googleSheetsRegistrationService.submitRegistration(formData);
      
      if (result.success) {
        setSuccess(true);
        setSuccessMessage(result.message);
        // Reset form
        setFormData({
          email: '',
          first_name: '',
          last_name: '',
          phone: '',
          college_id: '',
          year_of_study: '',
          branch: '',
          preferred_team: '',
          interests: '',
          experience: '',
          skills: '',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'ValidationError') {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: error.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s ease-in-out infinite alternate'
            }}
          ></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-2xl w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl font-bold text-white">SAE</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'Almarai, sans-serif'}}>
              Join SAE TKMCE
            </h2>
            <p className="text-gray-400 text-lg mb-4">
              Register for membership in Society of Automotive Engineers
            </p>
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        
        {success ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Registration Submitted!</h3>
              <p className="text-gray-300 mb-6">{successMessage}</p>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <span>🏠</span>
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8">
            <div className="bg-blue-900/30 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">💡</span>
                <p className="text-sm">
                  <strong>Note:</strong> Your registration will be reviewed by our team. You'll receive login credentials via email once approved.
                </p>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    {errors.general}
                  </div>
                </div>
              )}
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">👤</span>
                      </div>
                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter first name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name[0]}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">👤</span>
                      </div>
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter last name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name[0]}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">📧</span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">📱</span>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone[0]}</p>}
                </div>

                <div>
                  <label htmlFor="college_id" className="block text-sm font-medium text-gray-300 mb-2">
                    College ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🎓</span>
                    </div>
                    <input
                      id="college_id"
                      name="college_id"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      placeholder="Enter your college ID"
                      value={formData.college_id}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.college_id && <p className="text-red-400 text-xs mt-1">{errors.college_id[0]}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="year_of_study" className="block text-sm font-medium text-gray-300 mb-2">
                      Year of Study
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">📚</span>
                      </div>
                      <select
                        id="year_of_study"
                        name="year_of_study"
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 appearance-none"
                        value={formData.year_of_study}
                        onChange={handleChange}
                      >
                        <option value="" className="bg-gray-800">Select year</option>
                        <option value="1" className="bg-gray-800">1st Year</option>
                        <option value="2" className="bg-gray-800">2nd Year</option>
                        <option value="3" className="bg-gray-800">3rd Year</option>
                        <option value="4" className="bg-gray-800">4th Year</option>
                      </select>
                    </div>
                    {errors.year_of_study && <p className="text-red-400 text-xs mt-1">{errors.year_of_study[0]}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
                      Branch
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">🔬</span>
                      </div>
                      <select
                        id="branch"
                        name="branch"
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 appearance-none"
                        value={formData.branch}
                        onChange={handleChange}
                      >
                        <option value="" className="bg-gray-800">Select branch</option>
                        <option value="CSE" className="bg-gray-800">Computer Science</option>
                        <option value="ECE" className="bg-gray-800">Electronics</option>
                        <option value="ME" className="bg-gray-800">Mechanical</option>
                        <option value="CE" className="bg-gray-800">Civil</option>
                        <option value="EEE" className="bg-gray-800">Electrical</option>
                        <option value="CHE" className="bg-gray-800">Chemical</option>
                        <option value="BT" className="bg-gray-800">Biotechnology</option>
                        <option value="IT" className="bg-gray-800">Information Technology</option>
                      </select>
                    </div>
                    {errors.branch && <p className="text-red-400 text-xs mt-1">{errors.branch[0]}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="preferred_team" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Team
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🏁</span>
                    </div>
                    <select
                      id="preferred_team"
                      name="preferred_team"
                      className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 appearance-none"
                      value={formData.preferred_team}
                      onChange={handleChange}
                    >
                      <option value="" className="bg-gray-800">Select preferred team (optional)</option>
                      <option value="VEGHA" className="bg-gray-800">VEGHA - Vehicle Engineering & Green Hybrid Automotive</option>
                      <option value="HBAJA" className="bg-gray-800">HBAJA - Heavy Baja SAE Team</option>
                      <option value="MBAJA" className="bg-gray-800">MBAJA - Mini Baja SAE Team</option>
                      <option value="XLR8 Racing" className="bg-gray-800">XLR8 Racing - Formula SAE Racing Team</option>
                      <option value="XLR8FST" className="bg-gray-800">XLR8FST - Formula Student Racing Team</option>
                      <option value="XLR8 E-racing" className="bg-gray-800">XLR8 E-racing - Electric Racing Team</option>
                      <option value="SPOX" className="bg-gray-800">SPOX - Electric Bicycle Design Team</option>
                    </select>
                  </div>
                  {errors.preferred_team && <p className="text-red-400 text-xs mt-1">{errors.preferred_team[0]}</p>}
                </div>

                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-300 mb-2">
                    Interests
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="text-gray-400">💡</span>
                    </div>
                    <textarea
                      id="interests"
                      name="interests"
                      rows={3}
                      className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                      placeholder="Tell us about your interests in automotive engineering..."
                      value={formData.interests}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.interests && <p className="text-red-400 text-xs mt-1">{errors.interests[0]}</p>}
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
                    Experience
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="text-gray-400">🛠️</span>
                    </div>
                    <textarea
                      id="experience"
                      name="experience"
                      rows={3}
                      className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                      placeholder="Any relevant experience or projects..."
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience[0]}</p>}
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">
                    Skills
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="text-gray-400">⚡</span>
                    </div>
                    <textarea
                      id="skills"
                      name="skills"
                      rows={3}
                      className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                      placeholder="List your technical skills..."
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills[0]}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>🚀</span>
                      <span>Submit Registration</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Register;
