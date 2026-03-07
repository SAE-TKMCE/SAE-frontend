import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// ─── Token type helpers ───────────────────────────────────────────────────────

const isMembershipId = (token) =>
  token.toUpperCase().startsWith('SAETKMCE');

// ─── Backend-first verification ───────────────────────────────────────────────

const verifyToken = async (rawToken) => {
  const token = (rawToken || '').trim();
  if (!token) return { found: false };

  const canonicalToken = isMembershipId(token) ? token.toUpperCase() : token;

  const endpoint = isMembershipId(canonicalToken)
    ? `${API_BASE}/membership/community-verify/${canonicalToken}/`
    : `${API_BASE}/membership/verify/${canonicalToken}/`;

  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.valid) {
      const d = data.data;
      return {
        found: true,
        member: {
          name: d.name || '',
          branch: d.branch || '',
          membershipId: d.membershipId || d.membership_card_id || canonicalToken,
          membershipType: d.membershipType || 'Community Membership',
          joiningYear: d.joiningYear || (d.valid_from_formatted ? d.valid_from_formatted.slice(-4) : ''),
          completionYear: d.completionYear || (d.valid_till_formatted ? d.valid_till_formatted.slice(-4) : ''),
          isActive: d.isActive !== undefined ? d.isActive : (d.is_active !== undefined ? d.is_active : true),
        },
      };
    }

    return { found: false };
  } catch (_) {
    return { found: false };
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const VerifiedCard = ({ member }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-400 max-w-md w-full mx-auto">
    {/* Green verified header */}
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <div className="text-white font-black text-base">Verified Member</div>
        <div className="text-green-100 text-xs">SAE TKMCE Community</div>
      </div>
    </div>

    {/* Card body */}
    <div className="px-6 py-5">
      {/* Logo + Name */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl shadow flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}
        >
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-gray-900 font-black text-lg">{member.name}</div>
          {member.branch && (
            <div className="text-blue-600 text-sm font-medium">{member.branch}</div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <InfoRow label="Membership Number" value={member.membershipId} mono />
        <InfoRow label="Membership Type" value={member.membershipType} />
        <InfoRow label="Organisation" value="SAE TKMCE" />
        {(member.joiningYear || member.completionYear) && (
          <InfoRow
            label="Validity"
            value={`${member.joiningYear} \u2013 ${member.completionYear}`}
          />
        )}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500 text-sm">Status</span>
          <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            Active Member
          </span>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="px-6 py-3 bg-blue-50 flex items-center justify-between">
      <img src="/logo.png" alt="SAE TKMCE" className="h-8 object-contain" />
      <span className="text-blue-400 text-xs">TKM College of Engineering</span>
    </div>
  </div>
);

const InfoRow = ({ label, value, mono }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className={`text-gray-900 font-semibold text-sm ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</span>
  </div>
);

const NotFoundCard = ({ id }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-300 max-w-md w-full mx-auto">
    <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <div className="text-white font-black text-base">Not Found</div>
        <div className="text-red-100 text-xs">No membership record found</div>
      </div>
    </div>
    <div className="px-6 py-5 text-center">
      <p className="text-gray-600 mb-2">No active member found for:</p>
      <p className="font-mono font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded text-sm break-all">{id}</p>
      <p className="text-gray-500 text-sm mt-3">Please check the membership ID and try again.</p>
    </div>
  </div>
);

const QRScanner = ({ onResult }) => {
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const startScanner = async () => {
    setError('');
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-reader-element');
      scannerInstanceRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          // Extract token from URL if present, otherwise use text directly (preserve case for card tokens)
          let token = decodedText.trim();
          try {
            const url = new URL(decodedText);
            const parts = url.pathname.split('/').filter(Boolean);
            token = parts[parts.length - 1] || decodedText.trim();
          } catch (_) {
            // Not a URL, use as-is
          }
          scanner.stop().then(() => {
            setStarted(false);
            onResult(token);
          }).catch(() => {});
        },
        () => {}
      );
      setStarted(true);
    } catch (err) {
      setError('Camera access denied or not available. Please use the search option below.');
    }
  };

  const stopScanner = () => {
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.stop().then(() => {
        setStarted(false);
      }).catch(() => setStarted(false));
    }
  };

  useEffect(() => {
    return () => {
      if (scannerInstanceRef.current) {
        try { scannerInstanceRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        id="qr-reader-element"
        ref={scannerRef}
        className="w-full max-w-xs rounded-xl overflow-hidden"
        style={{ minHeight: started ? 280 : 0 }}
      />
      {!started ? (
        <button
          onClick={startScanner}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Start Camera Scan
        </button>
      ) : (
        <button
          onClick={stopScanner}
          className="flex items-center gap-1.5 text-red-500 border border-red-300 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
        >
          Stop Camera
        </button>
      )}
      {error && (
        <p className="text-red-500 text-sm text-center max-w-xs">{error}</p>
      )}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const MemberVerification = () => {
  const { membershipId: urlId } = useParams();
  const [searchInput, setSearchInput] = useState('');
  const [result, setResult] = useState(null); // null | { found, member, searched }
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const runVerification = async (token, displayToken) => {
    setLoading(true);
    try {
      const outcome = await verifyToken(token);
      setResult({ ...outcome, searched: displayToken || token });
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify if ID is in the URL (from QR scan redirect)
  useEffect(() => {
    if (urlId) {
      runVerification(urlId, urlId.toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId]);

  const handleSearch = (e) => {
    e.preventDefault();
    const id = searchInput.trim();
    if (!id) return;
    runVerification(id, id.toUpperCase());
  };

  const handleQRResult = (token) => {
    const display = isMembershipId(token) ? token.toUpperCase() : token;
    setActiveTab('search');
    setSearchInput(display);
    runVerification(token, display);
  };

  const handleReset = () => {
    setResult(null);
    setSearchInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-8">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm mb-6 w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="text-center">
          <img src="/logo.png" alt="SAE TKMCE" className="h-14 mx-auto mb-3 object-contain" />
          <h1 className="text-2xl font-black text-gray-900">Member Verification</h1>
          <p className="text-gray-500 mt-1 text-sm">Verify SAE TKMCE Community Membership</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Loading spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="text-gray-500 text-sm">Verifying membership...</span>
          </div>
        )}

        {/* Result display */}
        {!loading && result && (
          <div className="mb-6">
            {result.found ? (
              <VerifiedCard member={result.member} />
            ) : (
              <NotFoundCard id={result.searched} />
            )}
            <div className="text-center mt-4">
              <button
                onClick={handleReset}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Search another member
              </button>
            </div>
          </div>
        )}

        {/* Search / Scan panel */}
        {!loading && !result && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                className={`flex-1 py-3 text-sm font-bold transition-colors ${
                  activeTab === 'search'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('search')}
              >
                Search by ID
              </button>
              <button
                className={`flex-1 py-3 text-sm font-bold transition-colors ${
                  activeTab === 'scan'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('scan')}
              >
                Scan QR Code
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'search' && (
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Membership ID
                    </label>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="e.g. SAETKMCE001ME"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      autoComplete="off"
                      autoFocus
                    />
                    <p className="text-gray-400 text-xs mt-1.5">
                      Format: SAETKMCE + number + branch code (e.g. SAETKMCE001ME)
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={!searchInput.trim()}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Verify Member
                  </button>
                </form>
              )}

              {activeTab === 'scan' && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm text-center">
                    Point your camera at a member's QR code to instantly verify their membership.
                  </p>
                  <QRScanner onResult={handleQRResult} />
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-gray-400 text-xs">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="w-full text-blue-600 border border-blue-200 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Enter Membership ID manually
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Official membership verification portal &mdash; SAE TKMCE
        </p>
      </div>
    </div>
  );
};

export default MemberVerification;
