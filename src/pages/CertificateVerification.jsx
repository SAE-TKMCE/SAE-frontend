import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { certificatesService } from '../services/certificates';

/* 🔧 Speedometer Loader */
function SpeedometerLoader() {
  const [angle, setAngle] = useState(0);
  const [gear, setGear] = useState('1st Gear');

  useEffect(() => {
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      // Needle starts from 0deg (leftmost), ends at 90deg (rightmost)
      const maxAngle = 90;
      const angle = Math.min(frame * 4.5, maxAngle); // 20 steps
      setAngle(angle);
      // Set gear based on angle
      if (angle < 18) setGear('1st Gear');
      else if (angle < 36) setGear('2nd Gear');
      else if (angle < 54) setGear('3rd Gear');
      else if (angle < 72) setGear('4th Gear');
      else setGear('Redline!');
      if (frame >= 20) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center" style={{margin:'0.5rem 0'}}>
      <svg width="96" height="64" viewBox="0 0 48 32">
        <path d="M8 28 A16 16 0 0 1 40 28" stroke="#eab308" strokeWidth="3" fill="none" />
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '24px 28px' }}>
          <rect x="23" y="12" width="2" height="16" fill="#f87171" />
        </g>
        <circle cx="24" cy="28" r="3" fill="#52525b" />
      </svg>
      <div className="text-yellow-400 font-bold text-base mt-2">{gear}</div>
    </div>
  );
}

export default function CertificateVerification() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [animateIndex, setAnimateIndex] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pinRef0 = useRef(null);
  const pinRef1 = useRef(null);
  const pinRef2 = useRef(null);
  const pinRef3 = useRef(null);
  const pinRefs = React.useMemo(() => [pinRef0, pinRef1, pinRef2, pinRef3], [pinRef0, pinRef1, pinRef2, pinRef3]);

  /* ✅ Auto-focus first PIN box */
  useEffect(() => {
    pinRefs[0].current?.focus();
  }, [pinRefs]);

  /* ✅ Digits only + animation */
  const handlePinChange = (e, idx) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) return;

    const newPin = [...pin];
    newPin[idx] = digit;
    setPin(newPin);
    setAnimateIndex(idx);
    setTimeout(() => setAnimateIndex(null), 150);

    if (idx < 3) pinRefs[idx + 1].current?.focus();
  };

  const handlePinKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && pin[idx] === '' && idx > 0) {
      pinRefs[idx - 1].current?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) pinRefs[idx - 1].current?.focus();
    if (e.key === 'ArrowRight' && idx < 3) pinRefs[idx + 1].current?.focus();
  };

  /* ✅ Paste full PIN */
  const handlePinPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      setPin(pasted.split(''));
      pinRefs[3].current?.focus();
    }
  };
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setCertificate(null);

    const pinValue = pin.join('');
    if (!email.trim() || pinValue.length !== 4 || pin.includes('')) {
      setError('Please enter a valid email and Last 4-digit Ticket Code');
      return;
    }

    setLoading(true);
    try {
      const data = await certificatesService.verifyCertificate(email, pinValue);
      setCertificate(data);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid credentials or certificate not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!certificate?.image_url) return;
    try {
      const res = await fetch(certificate.image_url);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = certificate.filename || 'certificate.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download image.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative">
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
      <div className="max-w-lg w-full bg-zinc-900 p-8 rounded-xl border border-yellow-900 z-10">

        <div className="text-center mb-6">
          <div className="text-4xl font-extrabold tracking-widest text-yellow-400">
            CERTIFICATE
          </div>
          <div className="text-gray-300">Verification Portal</div>

        
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="email"
            placeholder="Registered Email"
            className="w-full px-4 py-2 rounded bg-zinc-800 border-zinc-700 text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          
          <div className="text-sm text-gray-400">Enter the last 4 digits of your Ticket Code</div>
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map(idx => (
              <input
                key={idx}
                ref={pinRefs[idx]}
                value={pin[idx]}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                type="password"
                onPaste={idx === 0 ? handlePinPaste : undefined}
                onChange={e => handlePinChange(e, idx)}
                onKeyDown={e => handlePinKeyDown(e, idx)}
x                className={`w-12 h-12 text-center text-2xl font-bold rounded bg-zinc-800 border border-zinc-700 text-white transition-all duration-150
                  ${animateIndex === idx ? 'scale-110 ring-2 ring-yellow-400' : ''}
                `}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 mx-auto text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : 'View Certificate'}
          </button>
        </form>

        {loading && (<div className="mt-6">
          <SpeedometerLoader />
        </div>
        )}
        {error && (
          <div className="mt-4 text-red-300 bg-red-900/30 p-3 rounded">
            {error}
          </div>
        )}

        {certificate && (
          <div className="mt-6 bg-zinc-950 p-6 rounded-xl border border-green-700 text-center">
            <div className="text-green-400 font-bold mb-2">
              ✅ Verified by SAE TKMCE
            </div>

            <div className="text-white mb-2">
              Certificate Found for <b>{certificate.name}</b>
            </div>

            <img
              src={certificate.image_url}
              alt="Certificate"
              className="mx-auto border-4 border-yellow-400 rounded"
            />

            <button className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded font-semibold" onClick={handleDownload}>
              View Full Quality
            </button>
          </div>
        )}

      </div>
    </div>
  );
}