import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    admission_number: '',
    branch: '',
    semester: '',
    membership_type: 'web_team',
    skills: '',
    github_profile: '',
    portfolio_link: '',
    linkedin_profile: '',
    why_join: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const branches = [
    'Computer Science',
    'Artificial Intelligence',
    'Mechanical',
    'Civil',
    'Electrical and Electronics',
    'Electrical and Computer',
    'Electronics and Communication',
  ];

  const semesters = ['S2', 'S4', 'S6', ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Phone number must be 10 digits';
    }

    if (!formData.admission_number.trim()) newErrors.admission_number = 'Roll number is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    
    if (!formData.skills.trim()) newErrors.skills = 'Technical skills are required';
    if (!formData.why_join.trim()) newErrors.why_join = 'Why do you want to join the Web Team? is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
      await axios.post(`${apiBase}/api/membership/register/`, {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        admission_number: formData.admission_number,
        branch: formData.branch,
        semester: formData.semester,
        membership_type: 'web_team',
        skills: formData.skills,
        github_profile: formData.github_profile,
        portfolio_link: formData.portfolio_link,
        linkedin_profile: formData.linkedin_profile,
        why_join: formData.why_join
      });

      setSuccess(true);
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        admission_number: '',
        branch: '',
        semester: '',
        membership_type: 'web_team',
        skills: '',
        github_profile: '',
        portfolio_link: '',
        linkedin_profile: '',
        why_join: ''
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Application failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-100">
          <strong>Application Submitted Successfully!</strong>
          <p className="mt-2">Thank you for applying to SAE TKMCE Web Team 2026. We'll review your application and contact you soon.</p>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
          {errors.general}
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400 rounded-lg text-blue-100">
        <h3 className="font-semibold mb-2">📢 Web Team Recruitment 2026</h3>
        <p className="text-sm">We're looking for passionate developers to join our Web Team. Skills in React, Node.js, Django, or UI/UX are highly valued!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Your Name"
          />
          {errors.full_name && <p className="mt-1 text-sm text-red-300">{errors.full_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Personal Email Address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9876543210"
          />
          {errors.phone_number && <p className="mt-1 text-sm text-red-300">{errors.phone_number}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Roll Number *</label>
          <input
            type="text"
            name="admission_number"
            value={formData.admission_number}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Eg: B23ECBXX"
          />
          {errors.admission_number && <p className="mt-1 text-sm text-red-300">{errors.admission_number}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Branch *</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="bg-gray-800">Select Branch</option>
            {branches.map(branch => (
              <option key={branch} value={branch} className="bg-gray-800">{branch}</option>
            ))}
          </select>
          {errors.branch && <p className="mt-1 text-sm text-red-300">{errors.branch}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Semester *</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="bg-gray-800">Select Semester</option>
            {semesters.map(sem => (
              <option key={sem} value={sem} className="bg-gray-800">{sem}</option>
            ))}
          </select>
          {errors.semester && <p className="mt-1 text-sm text-red-300">{errors.semester}</p>}
        </div>

        <div className="md:col-span-2 -mt-2 text-sm text-indigo-100/90">
          This application creates your SAE TKMCE member account for login and application tracking.
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Technical Skills *</label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., React, JavaScript, Python, Django, Node.js, HTML/CSS, Git, etc."
          />
          {errors.skills && <p className="mt-1 text-sm text-red-300">{errors.skills}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">GitHub Profile</label>
          <input
            type="url"
            name="github_profile"
            value={formData.github_profile}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Portfolio/Project Link</label>
          <input
            type="url"
            name="portfolio_link"
            value={formData.portfolio_link}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://yourportfolio.com or project link"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">LinkedIn Profile</label>
          <input
            type="url"
            name="linkedin_profile"
            value={formData.linkedin_profile}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://www.linkedin.com/in/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Why do you want to join the Web Team? *</label>
          <textarea
            name="why_join"
            value={formData.why_join}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your motivation and what you hope to contribute..."
          />
          {errors.why_join && <p className="mt-1 text-sm text-red-300">{errors.why_join}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting Application...' : 'Apply to Web Team 2026'}
      </button>

      <p className="mt-4 text-sm text-white/70 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
          Login here
        </a>
      </p>
    </form>
  );
};

export default RegistrationForm;
