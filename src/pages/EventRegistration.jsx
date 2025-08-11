import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventsService } from '../services/events';
import googleSheetsEventRegistrationService from '../services/googleSheetsEventRegistration';

const styles = `
  @keyframes gridMove {
    0% { background-position: 0 0; }
    100% { background-position: 100px 100px; }
  }
`;

const EventRegistration = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    participant_name: '',
    email: '',
    phone: '',
    college_id: '',
    year_of_study: '',
    branch: '',
    team_size: '1',
    team_members: '',
    dietary_requirements: '',
    emergency_contact: '',
    previous_experience: '',
    expectations: '',
    payment_method: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await eventsService.getEvent(eventId);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setErrors({ general: 'Failed to load event details' });
      } finally {
        setLoading(false);
      }
    };
    if (eventId) load();
  }, [eventId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess(false);

    try {
      const registrationData = {
        event_id: event?.id,
        event_title: event?.title,
        event_date: event?.date ? new Date(event.date).toLocaleDateString('en-IN') : '',
        event_venue: event?.venue || event?.location || '',
        event_type: event?.event_type || event?.category || '',
        participant_name: formData.participant_name,
        email: formData.email,
        phone: formData.phone,
        college_id: formData.college_id,
        year_of_study: formData.year_of_study,
        branch: formData.branch,
        team_size: formData.team_size,
        team_members: formData.team_members,
        dietary_requirements: formData.dietary_requirements,
        emergency_contact: formData.emergency_contact,
        previous_experience: formData.previous_experience,
        expectations: formData.expectations,
        registration_fee: event?.registration_fee,
        member_fee: event?.member_fee,
        is_member: false,
        payment_method: formData.payment_method,
      };

      const result = await googleSheetsEventRegistrationService.submitEventRegistration(registrationData);
      if (result.success) {
        setSuccess(true);
        setSuccessMessage(result.message);
        setFormData({
          participant_name: '', email: '', phone: '', college_id: '', year_of_study: '', branch: '',
          team_size: '1', team_members: '', dietary_requirements: '', emergency_contact: '',
          previous_experience: '', expectations: '', payment_method: ''
        });
      }
    } catch (err) {
      const msg = err.name === 'ValidationError' ? err.message : (err.message || 'Event registration failed. Please try again.');
      setErrors({ general: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="max-w-3xl w-full space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl font-bold text-white">SAE</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>

            {loading ? (
              <>
                <h2 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'Almarai, sans-serif'}}>
                  Loading Event...
                </h2>
                <p className="text-gray-400 text-lg">Please wait while we fetch the details.</p>
              </>
            ) : !event ? (
              <>
                <h2 className="text-3xl font-black text-white mb-2">Event Not Found</h2>
                <p className="text-gray-400 mb-6">The event you're looking for could not be found.</p>
                <Link to="/events" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">Back to Events</Link>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'Almarai, sans-serif'}}>
                  Register for {event.title}
                </h2>
                <p className="text-gray-400 text-lg">Fill in your details to complete the registration</p>
              </>
            )}
          </div>

          {/* Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8">
            {!loading && event && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center"><span className="w-5">📅</span><span>{new Date(event.date).toLocaleDateString('en-IN')}</span></div>
                <div className="flex items-center"><span className="w-5">📍</span><span>{event.venue || event.location}</span></div>
                <div className="flex items-center"><span className="w-5">🏷️</span><span className="capitalize">{event.event_type || event.category || 'event'}</span></div>
                <div className="flex items-center"><span className="w-5">💰</span><span>₹{event.registration_fee} {event.member_fee ? `(₹${event.member_fee} for members)` : ''}</span></div>
              </div>
            )}

            {success ? (
              <div className="bg-green-900/40 border border-green-500/40 text-green-300 px-4 py-5 rounded-lg text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-200 mb-2">Registration Submitted!</h3>
                <p className="text-sm mb-4">{successMessage}</p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/events"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Back to Events
                  </Link>
                  <button
                    onClick={() => { setSuccess(false); setSuccessMessage(''); }}
                    className="border border-green-500/60 text-green-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-900/40 transition-colors duration-200"
                  >
                    Register Another
                  </button>
                </div>
              </div>
            ) : (
              <>
                {!loading && event && (
                  <div className="bg-blue-900/30 border border-blue-500/40 text-blue-200 px-4 py-3 rounded-lg mb-6">
                    <p className="text-sm">
                      <strong className="text-white/90">Note:</strong> Your registration will be reviewed by our team. You'll receive payment instructions and confirmation via email.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-900/40 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg">
                      {errors.general}
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>

                    <div>
                      <label htmlFor="participant_name" className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input
                        id="participant_name"
                        name="participant_name"
                        type="text"
                        required
                        className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter your full name"
                        value={formData.participant_name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Academic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="college_id" className="block text-sm font-medium text-gray-300 mb-2">College ID *</label>
                        <input
                          id="college_id"
                          name="college_id"
                          type="text"
                          required
                          className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          placeholder="Your college ID"
                          value={formData.college_id}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="year_of_study" className="block text-sm font-medium text-gray-300 mb-2">Year of Study *</label>
                        <select
                          id="year_of_study"
                          name="year_of_study"
                          required
                          className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          value={formData.year_of_study}
                          onChange={handleChange}
                        >
                          <option value="">Select year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">Branch *</label>
                        <select
                          id="branch"
                          name="branch"
                          required
                          className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          value={formData.branch}
                          onChange={handleChange}
                        >
                          <option value="">Select branch</option>
                          <option value="CSE">Computer Science</option>
                          <option value="ECE">Electronics</option>
                          <option value="ME">Mechanical</option>
                          <option value="CE">Civil</option>
                          <option value="EEE">Electrical</option>
                          <option value="CHE">Chemical</option>
                          <option value="BT">Biotechnology</option>
                          <option value="IT">Information Technology</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Team Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Team Information</h3>

                    <div>
                      <label htmlFor="team_size" className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                      <select
                        id="team_size"
                        name="team_size"
                        className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        value={formData.team_size}
                        onChange={handleChange}
                      >
                        <option value="1">Individual (1)</option>
                        <option value="2">Team of 2</option>
                        <option value="3">Team of 3</option>
                        <option value="4">Team of 4</option>
                        <option value="5">Team of 5</option>
                      </select>
                    </div>

                    {parseInt(formData.team_size) > 1 && (
                      <div>
                        <label htmlFor="team_members" className="block text-sm font-medium text-gray-300 mb-2">Team Members (Names and College IDs)</label>
                        <textarea
                          id="team_members"
                          name="team_members"
                          rows={3}
                          className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          placeholder="List team member names and their college IDs..."
                          value={formData.team_members}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Additional Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dietary_requirements" className="block text-sm font-medium text-gray-300 mb-2">Dietary Requirements</label>
                        <input
                          id="dietary_requirements"
                          name="dietary_requirements"
                          type="text"
                          className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          placeholder="Vegetarian, Vegan, Allergies, etc."
                          value={formData.dietary_requirements}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact</label>
                        <input
                          id="emergency_contact"
                          name="emergency_contact"
                          type="text"
                          className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          placeholder="Name and phone number"
                          value={formData.emergency_contact}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="previous_experience" className="block text-sm font-medium text-gray-300 mb-2">Previous Experience</label>
                      <textarea
                        id="previous_experience"
                        name="previous_experience"
                        rows={3}
                        className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="Tell us briefly about your relevant experience"
                        value={formData.previous_experience}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="expectations" className="block text-sm font-medium text-gray-300 mb-2">What do you expect from this event?</label>
                      <textarea
                        id="expectations"
                        name="expectations"
                        rows={3}
                        className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="Share your expectations"
                        value={formData.expectations}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Payment</h3>
                    <div>
                      <label htmlFor="payment_method" className="block text-sm font-medium text-gray-300 mb-2">Preferred Payment Method</label>
                      <select
                        id="payment_method"
                        name="payment_method"
                        className="block w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        value={formData.payment_method}
                        onChange={handleChange}
                      >
                        <option value="">Select a method</option>
                        <option value="online">Online Payment</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {submitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>🎯</span>
                          <span>Submit Registration</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="text-center">
            <Link to="/events" className="text-blue-400 hover:text-blue-300">← Back to Events</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventRegistration;