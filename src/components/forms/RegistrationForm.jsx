import React, { useRef, useState } from 'react';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = '03b74bf4-b189-40c5-9cd9-17d50f227946';

const INLINE_ERROR_FIELDS = new Set([
  'full_name',
  'email',
  'phone_number',
  'admission_number',
  'branch',
  'semester',
  'skills',
  'github_profile',
  'portfolio_link',
  'linkedin_profile',
  'why_join'
]);

const FIELD_FOCUS_ORDER = [
  'full_name',
  'email',
  'phone_number',
  'admission_number',
  'branch',
  'semester',
  'skills',
  'github_profile',
  'portfolio_link',
  'linkedin_profile',
  'why_join'
];

const toErrorString = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) return value.map(toErrorString).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    return Object.values(value).map(toErrorString).filter(Boolean).join(' ');
  }
  return String(value).trim();
};

const normalizeApiErrors = (payload) => {
  const normalized = {};
  const generalParts = [];

  if (!payload) {
    normalized.general = 'Application failed. Please try again.';
    return normalized;
  }

  if (typeof payload === 'string') {
    normalized.general = payload;
    return normalized;
  }

  if (Array.isArray(payload)) {
    const msg = toErrorString(payload);
    normalized.general = msg || 'Application failed. Please try again.';
    return normalized;
  }

  Object.entries(payload).forEach(([key, value]) => {
    const message = toErrorString(value);
    if (!message) return;

    if (key === 'detail' || key === 'error' || key === 'message' || key === 'non_field_errors') {
      generalParts.push(message);
      return;
    }

    normalized[key] = message;
  });

  if (generalParts.length) {
    normalized.general = generalParts.join(' ');
  }

  if (!Object.keys(normalized).length) {
    normalized.general = 'Application failed. Please try again.';
  }

  return normalized;
};

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
  const formRef = useRef(null);
  const errorBannerRef = useRef(null);

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

  const extraErrors = Object.entries(errors).filter(
    ([field, message]) =>
      field !== 'general' &&
      !INLINE_ERROR_FIELDS.has(field) &&
      Boolean(toErrorString(message))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const focusAndScrollToFirstError = (nextErrors) => {
    window.requestAnimationFrame(() => {
      const firstInvalidField = FIELD_FOCUS_ORDER.find((field) => Boolean(nextErrors[field]));

      if (firstInvalidField && formRef.current) {
        const fieldElement = formRef.current.querySelector(`[name="${firstInvalidField}"]`);
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (typeof fieldElement.focus === 'function') {
            fieldElement.focus({ preventScroll: true });
          }
          return;
        }
      }

      if (errorBannerRef.current) {
        errorBannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const raiseFormErrors = (nextErrors) => {
    setErrors(nextErrors);
    focusAndScrollToFirstError(nextErrors);
    alert('An error occurred. Please contact the Coordinators for review.');
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

    if (Object.keys(newErrors).length > 0) {
      raiseFormErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = new FormData();
      payload.append('access_key', WEB3FORMS_ACCESS_KEY);
      payload.append('subject', `SAE Web Team Application: ${formData.full_name}`);
      payload.append('from_name', 'SAE TKMCE Web Team Registration');
      payload.append('botcheck', '');

      payload.append('full_name', formData.full_name.trim());
      payload.append('email', formData.email.trim());
      payload.append('phone_number', formData.phone_number.trim());
      payload.append('admission_number', formData.admission_number.trim());
      payload.append('branch', formData.branch);
      payload.append('semester', formData.semester);
      payload.append('membership_type', 'web_team');
      payload.append('skills', formData.skills.trim());
      payload.append('github_profile', formData.github_profile.trim());
      payload.append('portfolio_link', formData.portfolio_link.trim());
      payload.append('linkedin_profile', formData.linkedin_profile.trim());
      payload.append('why_join', formData.why_join.trim());

      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: payload
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok || !responseData.success) {
        if (response.status === 400 || response.status === 422) {
          raiseFormErrors(normalizeApiErrors(responseData));
        } else if (response.status === 401) {
          raiseFormErrors({ general: 'Unauthorized request (401). Web3Forms key may be invalid.' });
        } else if (response.status === 403) {
          raiseFormErrors({ general: 'Forbidden request (403). This submission is blocked by the API.' });
        } else if (response.status === 404) {
          raiseFormErrors({ general: 'Web3Forms endpoint was not found (404). Please try again later.' });
        } else if (response.status === 429) {
          raiseFormErrors({ general: 'Too many attempts (429). Please wait and try again.' });
        } else if (response.status >= 500) {
          raiseFormErrors({ general: 'Server error on form service. Please try again later.' });
        } else if (Object.keys(responseData).length > 0) {
          raiseFormErrors(normalizeApiErrors(responseData));
        } else {
          raiseFormErrors({ general: 'Application failed. Please try again.' });
        }
        return;
      }

      const successMessage = toErrorString(responseData.message) || 'Application submitted successfully.';
      alert(successMessage);
      
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
      raiseFormErrors({
        general: error.message || 'Network error: Unable to submit right now. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-100">
          <strong>Application Submitted Successfully!</strong>
          <p className="mt-2">Thank you for applying to SAE TKMCE Web Team 2026. We'll review your application and contact you soon.</p>
        </div>
      )}

      {errors.general && (
        <div ref={errorBannerRef} className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
          {errors.general}
        </div>
      )}

      {extraErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
          <p className="font-semibold">Additional validation errors:</p>
          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
            {extraErrors.map(([field, message]) => (
              <li key={field}>{field.replace(/_/g, ' ')}: {toErrorString(message)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400 rounded-lg text-blue-100">
        <h3 className="font-semibold mb-2">📢 Web Team Recruitment 2026</h3>
        <p className="text-sm">We're looking for passionate developers to join our Web Team. Skills in React, Django, or UI/UX are plus!</p>
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
          This form submits your SAE TKMCE Web Team application through our intake form service.
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
            placeholder=" ( Optional )"
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
            placeholder=" (Optional) "
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
            placeholder=" (Optional) "
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

      <p className="mt-2 text-sm text-white/70 text-center">
        Already applied?{' '}
        <a href="/check-status" className="text-green-400 hover:text-green-300 font-medium">
          Check your application status
        </a>
      </p>
    </form>
  );
};

export default RegistrationForm;
