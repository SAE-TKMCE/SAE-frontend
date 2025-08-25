
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  axios.get(`${apiBase}/api/membership/registration/`)
      .then(res => {
        if (res.data && res.data.embed_url) {
          setEmbedUrl(res.data.embed_url);
        } else {
          setEmbedUrl(null);
        }
      })
      .catch(err => {
        setError('Unable to load registration link.');
        setEmbedUrl(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white">
      <div className="max-w-lg w-full p-8  bg-white bg-opacity-0 animate-fade-in">
        <br></br>
        <br></br>
        <h1 className="text-4xl font-extrabold mb-4 text-center tracking-tight">Registration</h1>
        <p className="text-lg text-indigo-100 mb-6 text-center">Register for SAE TKMCE Membership</p>
        {loading ? (
          <div className="flex flex-col items-center">
            <span className="text-indigo-200 mb-2">Loading registration...</span>
            <video src="/Coming_soon_bg.mp4" autoPlay loop muted className="rounded-lg shadow-lg w-64 h-40 object-cover" />
          </div>
        ) : embedUrl ? (
          <div className="mb-8">
            <iframe
              src={embedUrl}
              title="Registration Form"
              width="100%"
              height="600"
              frameBorder="0"
              allowFullScreen
              style={{ borderRadius: '1rem', background: 'white' }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white mb-4">Registration Coming Soon</h3>
            <video src="/Coming_soon_bg.mp4" autoPlay loop muted className="rounded-lg shadow-lg w-64 h-40 object-cover" />
            {error && <p className="text-red-300 mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
