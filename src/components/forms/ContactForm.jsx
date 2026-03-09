import React, { useState } from 'react';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || '03b74bf4-b189-40c5-9cd9-17d50f227946';

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const toMessage = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) return value.map(toMessage).filter(Boolean).join(' ');
  if (typeof value === 'object') return Object.values(value).map(toMessage).filter(Boolean).join(' ');
  return String(value).trim();
};

const getWeb3FormsErrorMessage = (data, status) => {
  const apiMessage = toMessage(data?.message || data?.error || data?.errors || data?.detail);
  if (apiMessage) return apiMessage;

  if (status === 400) return 'Invalid form data. Please review all fields and try again.';
  if (status === 401 || status === 403) return 'Invalid access key or request is not allowed.';
  if (status === 429) return 'Too many submissions. Please wait a few minutes before retrying.';
  if (status >= 500) return 'Contact service is temporarily unavailable. Please try again later.';

  return 'Unable to submit the form right now. Please try again.';
};

export default function ContactForm() {
  const [result, setResult] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const nextErrors = {};
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!name) nextErrors.name = 'Name is required.';
    else if (name.length < 2) nextErrors.name = 'Name must be at least 2 characters.';

    if (!email) nextErrors.email = 'Email is required.';
    else if (!isValidEmail(email)) nextErrors.email = 'Please enter a valid email address.';

    if (!message) nextErrors.message = 'Message is required.';
    else if (message.length < 10) nextErrors.message = 'Message must be at least 10 characters.';

    return nextErrors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const validationErrors = validateForm(formData);

    setErrors({});
    setResult('');

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    formData.append('access_key', WEB3FORMS_ACCESS_KEY);

    setSubmitting(true);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setErrors({ general: getWeb3FormsErrorMessage(data, response.status) });
        setResult('Failed to send message.');
        return;
      }

      setResult('Success! Your message has been sent.');
      event.target.reset();
    } catch (error) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setErrors({ general: 'No internet connection. Please reconnect and try again.' });
      } else {
        setErrors({ general: error.message || 'Unexpected error occurred. Please try again.' });
      }
      setResult('Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {errors.general && (
        <p className="text-sm text-red-600" role="alert">{errors.general}</p>
      )}

      <div>
        <input type="text" name="name" required className="w-full rounded border px-3 py-2" placeholder="Your name" />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <input type="email" name="email" required className="w-full rounded border px-3 py-2" placeholder="you@example.com" />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <textarea name="message" required className="w-full rounded border px-3 py-2" rows="5" placeholder="Your message" />
        {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
      </div>

      <button type="submit" disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60">
        {submitting ? 'Submitting...' : 'Submit'}
      </button>

      <p className="text-sm text-gray-700">{result}</p>
    </form>
  );
}
