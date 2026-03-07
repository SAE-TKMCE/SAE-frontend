import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContextMock';


const formatName = (name) =>
  (name || '')
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');

const MembershipCard = () => {
  const { user } = useAuth();
  
  // ── Bulletproof Responsive Scaling ──
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        // Measure exact available pixel width inside the container
        const availableWidth = entries[0].contentRect.width;
        // 600 is our card's base width. Scale down if screen is smaller.
        setScale(availableWidth < 600 ? availableWidth / 600 : 1);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const verifyToken = user.cardToken || user.membershipId;
  const verifyUrl = `${window.location.origin}/verify-member/${verifyToken}`;

  const handlePrint = () => window.print();

  return (
    <div
      className="min-h-screen overflow-x-hidden flex flex-col items-center justify-center py-10 px-4 card-print-page relative bg-gray-900"
    >
      <style>{`
        @page { margin: 10mm; }

        /* ── Print styles ── */
        @media print {
          body, html { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          header, .navbar { display: none !important; }

          .card-print-page {
            width: 100% !important;
            height: auto !important;
            background: white !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            min-height: auto !important; 
            padding: 20px 0 !important;
            margin: 0 auto !important;
          }

          .card-print-scroll {
            overflow: visible !important;
            padding: 0 !important;
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
            margin-bottom: 20px !important;
          }

          /* Reset all scaling for the printer so it prints full size */
          .print-scale-reset {
            width: 600px !important;
            height: 380px !important;
          }

          #membership-card-printable {
            transform: scale(1) !important; 
            position: relative !important;
            box-shadow: none !important; /* Optional: cleaner printing */
            border: 1px solid #e5e7eb !important; /* Optional: guide line for cutting */
          }

          #membership-card-printable, 
          #membership-card-printable * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-animate { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes gridMove {
          0%   { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }
      `}</style>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s ease-in-out infinite alternate',
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${(i * 37 + 7) % 100}%`,
              top: `${(i * 53 + 11) % 100}%`,
              animationDelay: `${(i * 0.3) % 4}s`,
              animationDuration: `${3 + (i % 3) * 0.7}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Nav & Actions */}
      <div className="no-print relative z-10 w-full max-w-[600px] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <div className="flex gap-3">
          <Link
            to="/verify-member"
            className="text-sm font-medium text-blue-700 bg-white border border-blue-200 px-4 py-2 rounded shadow-sm hover:bg-blue-50 transition-colors"
          >
            Verify a Member
          </Link>
          <button
            onClick={handlePrint}
            className="text-sm font-medium bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save
          </button>
        </div>
      </div>

      {/* ── Responsive Card Container (Controlled by JS ResizeObserver) ── */}
      <div className="card-animate relative z-10 w-full max-w-[600px] pb-4 card-print-scroll" ref={containerRef}>
        <div 
          className="print-scale-reset mx-auto"
          style={{ 
            width: `${600 * scale}px`, 
            height: `${380 * scale}px`, 
            position: 'relative' 
          }}
        >
          <div
            id="membership-card-printable"
            className="bg-white"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '600px',
              height: '380px',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              borderRadius: '16px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* TIGHTENED F1 Geometric SVG Header */}
            <svg width="600" height="110" viewBox="0 0 600 110" className="absolute top-0 left-0 z-0">
              <polygon points="380,0 600,0 600,20 360,20" fill="#3b82f6" />
              <polygon points="0,0 350,0 310,40 600,40 600,75 280,75 260,95 0,95" fill="#1a56db" />
              <polygon points="250,75 280,75 260,95 230,95" fill="#2563eb" />
            </svg>

            {/* SAE Logo */}
            <div className="absolute top-6 left-10 z-10 flex items-center gap-2">
              <img
                src="/logo.png"
                alt="SAE"
                className="h-10 object-contain drop-shadow-md"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            {/* Title */}
            <div className="absolute top-[115px] left-10 z-10">
              <h1
                className="text-[22px] font-black text-gray-900 tracking-wider uppercase italic"
                style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
              >
                Membership License
              </h1>
            </div>

            {/* Body Content - STRICTLY LEFT ALIGNED */}
            <div className="absolute top-[160px] left-10 flex flex-col gap-[8px] z-10 w-[340px]">
              {[
                { label: 'Name', value: formatName(user.name) },
                { label: 'Validity', value: user.completionYear ? `${user.joiningYear || '2023'} – ${user.completionYear}` : '—' },
                { label: 'Branch', value: user.branch || '—' },
                { label: 'Type', value: user.membershipType || '—' },
              ].map((item, idx) => (
                <div className="flex items-center" key={idx}>
                  <div className="w-[100px] text-gray-600 font-medium text-[13px] text-left">
                    {item.label}
                  </div>
                  <div className="w-[20px] text-gray-900 font-bold text-[13px] text-left">:</div>
                  <div className="flex-1 text-gray-900 font-bold text-[14px] truncate text-left">
                    {item.value}
                  </div>
                </div>
              ))}

              {/* Status Row */}
              <div className="flex items-center mt-1">
                <div className="w-[100px] text-gray-600 font-medium text-[13px] text-left">
                  Current Status
                </div>
                <div className="w-[20px] text-gray-900 font-bold text-[13px] text-left">:</div>
                <div className="flex items-center gap-2 text-green-600 font-black text-[14px] uppercase tracking-wide text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></span>
                  Active
                </div>
              </div>
            </div>

            {/* Body Content - QR Code */}
            <div className="absolute top-[110px] right-10 z-10 flex flex-col items-center">
              <div
                className="w-[135px] h-[170px] rounded-[10px] flex items-center justify-center p-[2px] shadow-sm relative"
                style={{ background: 'linear-gradient(145deg, #e2e8f0, #cbd5e1)', border: '1px solid #e2e8f0' }}
              >
                <div className="bg-white w-full h-full rounded-[8px] flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(#64748b 1.5px, transparent 1.5px)',
                      backgroundSize: '12px 12px',
                    }}
                  ></div>
                  <QRCodeSVG
                    value={verifyUrl}
                    size={115}
                    bgColor="transparent"
                    fgColor="#0f172a"
                    level="H"
                    className="z-10"
                  />
                </div>
              </div>
            </div>

            {/* Footer - Membership ID */}
            <div className="absolute bottom-6 left-10 z-10 flex flex-col">
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">
                 Membership ID Number
               </div>
               <div className="text-[24px] font-black text-gray-900 font-mono tracking-[0.1em] leading-none">
                 {user.membershipId || 'TKM-XX-XXXX'}
               </div>
            </div>

            {/* Small Branding Bottom Right */}
            <div className="absolute bottom-6 right-10 z-10 text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Society of Automotive Engineers
              </div>
              <div className="text-[9px] text-gray-400 tracking-wider">
                TKM College of Engineering
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-4 text-gray-400 text-xs text-center max-w-sm" style={{ color: '#6b7280' }}>
        <b style={{ color: '#374151' }}>For Verification, visit:</b> sae.tkmce.ac.in/verify-member
      </p>
    </div>
  );
};

export default MembershipCard;