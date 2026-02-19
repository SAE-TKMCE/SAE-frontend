import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { certificatesService } from '../services/certificates';

const CertificateVerification = () => {

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setCertificate(null);
    if (!email.trim() || !pin.trim()) {
      setError('Please enter both email and PIN');
      return;
    }
    setLoading(true);
    try {
      const data = await certificatesService.verifyCertificate(email, pin);
      setCertificate(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials or certificate not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative" style={{background:'#18181b'}}>
      {/* Watermark background */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
        <svg width="100%" height="100%" style={{position:'absolute',top:0,left:0}}>
          <defs>
            <pattern id="watermark" width="180" height="60" patternUnits="userSpaceOnUse">
              <text x="0" y="40" fontSize="32" fill="#52525b" fontWeight="bold" opacity="0.18">SAE TKMCE</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#watermark)" />
        </svg>
      </div>
      <div className="relative z-10 max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Logos and Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-10 mb-2">
          </div>
          
          
        </div>
          {/* Heading and Description */}
          <div className="flex flex-col items-center mb-4">
            <div className="text-4xl font-extrabold tracking-widest text-yellow-400 mb-1" style={{letterSpacing:'0.1em'}}>CERTIFICATE</div>
            <div className="text-gray-200 font-semibold text-lg mb-2">Verification Portal</div>
            <div className="text-gray-400 text-sm mb-4">Society of Automotive Engineers • TKM College of Engineering</div>
          </div>

        <div className="bg-zinc-900/90 shadow-lg rounded-2xl p-8 mb-8 border border-yellow-900">
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-200 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="mt-1 flex-1 focus:ring-yellow-400 focus:border-yellow-400 block w-full min-w-0 rounded-md sm:text-sm border-zinc-700 bg-zinc-800 text-gray-100 px-4 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="pin" className="block text-sm font-bold text-gray-200 mb-1">Last 4 digits of Ticket Code (PIN)</label>
              <input
                type="password"
                name="pin"
                id="pin"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter your PIN"
                className="mt-1 flex-1 focus:ring-yellow-400 focus:border-yellow-400 block w-full min-w-0 rounded-md sm:text-sm border-zinc-700 bg-zinc-800 text-gray-100 px-4 py-2"
                required
                maxLength={4}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center px-6 py-2 border border-yellow-400 text-base font-bold rounded-md shadow-sm text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                'View Certificate'
              )}
            </button>
          </form>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-900 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-200">{error}</h3>
              </div>
            </div>
          </div>
        )}
        {/* Certificate Display */}
        {certificate && (
          <div className="bg-zinc-900/95 shadow rounded-2xl p-8 mt-8 text-center border border-yellow-900">
            <div className="text-green-400 font-bold mb-2">Certificate Found for {certificate.name}</div>
            <img src={certificate.image_url} alt="Certificate" className="mx-auto mb-3 border-4 border-yellow-400 rounded" style={{maxWidth:'100%', height:'auto'}} />
            <a href={certificate.image_url} download={certificate.filename} target="_blank" rel="noopener noreferrer">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold mt-2">Download Full Quality</button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification;