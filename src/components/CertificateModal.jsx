import React, { useState } from 'react';
import { certificatesService } from '../services/certificates';

const CertificateModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
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

  const handleClose = () => {
    setEmail('');
    setPin('');
    setCertificate(null);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleClose}
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className="bg-[#18181b] rounded-2xl shadow-2xl p-0 w-full max-w-xs relative flex flex-col items-center overflow-hidden border border-yellow-400"
        style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-yellow-400 text-2xl font-bold"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Illustration */}
        <div className="w-full flex flex-col items-center pt-8 pb-2">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Certificate" className="w-20 h-20 mb-2" style={{objectFit:'contain', filter:'brightness(0.95)'}} />
        </div>
        <div className="w-full px-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-1 text-center text-yellow-400">Certificate Download</h2>
          <p className="mb-4 text-gray-300 text-center text-sm">Enter your registered email and PIN to view your certificate.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mb-2">
            <input
              type="email"
              className="border border-yellow-400 bg-[#23232a] text-white rounded-lg px-4 py-2 w-full text-center focus:ring-2 focus:ring-yellow-400 placeholder-gray-400"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
            <div className="flex flex-col items-center w-full">
              <label className="text-xs text-yellow-300 mb-1">Last 4 digits in your Ticket</label>
              <div className="flex gap-2 justify-center">
                {[0,1,2,3].map(i => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center border border-yellow-400 rounded-lg text-xl focus:ring-2 focus:ring-yellow-400 text-yellow-300 bg-[#23232a] placeholder-yellow-200"
                    style={{ color: '#fde047', background: '#23232a', caretColor: '#fde047', fontWeight: 600, letterSpacing: 2 }}
                    value={pin[i] || ''}
                    onChange={e => {
                      let val = e.target.value.replace(/[^0-9]/g, '');
                      let newPin = pin.split('');
                      newPin[i] = val;
                      setPin(newPin.join('').slice(0,4));
                      // Move focus to next input
                      if (val && i < 3) {
                        const next = document.getElementById(`pin-input-${i+1}`);
                        if (next) next.focus();
                      }
                    }}
                    id={`pin-input-${i}`}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-[#18181b] px-4 py-2 rounded-lg w-full font-semibold transition"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Certificate'}
            </button>
          </form>
          {error && <div className="text-red-400 font-bold text-center mb-2">{error}</div>}
          {certificate && (
            <div className="mt-4 text-center w-full">
              <div className="text-green-400 font-semibold mb-2">Certificate Found for {certificate.name}</div>
              <img src={certificate.image_url} alt="Certificate" className="mx-auto mb-3 border-4 border-yellow-400 rounded" />
              <a href={certificate.image_url} download={certificate.filename} target="_blank" rel="noopener noreferrer">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-[#18181b] px-4 py-2 rounded-lg font-semibold">Download Full Quality</button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
