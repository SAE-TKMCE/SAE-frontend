import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const STORAGE_KEY = 'sae_member_user';
const TOKEN_KEY = 'sae_access_token';
const REFRESH_KEY = 'sae_refresh_token';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ─── Helper: pick only safe, non-sensitive fields ───────────────────────────
const safeUser = (data) => ({
  name: data.name,
  branch: data.branch || data.department || '',
  membershipId: data.membershipId || data.membership_card_id || '',
  membershipType: data.membershipType || data.membership_type || 'Community Membership',
  joiningYear: data.joiningYear || data.joining_year || '',
  completionYear: data.completionYear || data.completion_year || data.valid_till?.slice(0, 4) || '',
  cardToken: data.cardToken || data.card_token || null,
  isAdmin: data.isAdmin || false,
  source: data.source || 'local',
});

// ─── Backend helpers ─────────────────────────────────────────────────────────

const backendLogin = async (email, password) => {
  // SimpleJWT token endpoint: returns { access, refresh }
  const res = await fetch(`${API_BASE}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    signal: AbortSignal.timeout(5000), // 5-second timeout
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Invalid credentials');
  }
  return res.json(); // { access, refresh }
};

const fetchMemberCard = async (accessToken) => {
  const res = await fetch(`${API_BASE}/membership/applications/card/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) return null;
  return res.json();
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = async (email, phone) => {
    try {
      const { access, refresh } = await backendLogin(email, phone);

      localStorage.setItem(TOKEN_KEY, access);
      localStorage.setItem(REFRESH_KEY, refresh);

      const cardData = await fetchMemberCard(access);

      const userData = safeUser({
        name: cardData?.name || email.split('@')[0],
        branch: cardData?.branch || '',
        membershipId: cardData?.membership_card_id || '',
        membershipType: 'Community Membership',
        joiningYear: cardData?.valid_from?.slice(0, 4) || '',
        completionYear: cardData?.valid_till?.slice(0, 4) || '',
        cardToken: cardData?.card_token || null,
        isAdmin: cardData?.is_admin || false,
        source: 'backend',
      });

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return userData;

    } catch (err) {
      const isNetworkError =
        err.name === 'TypeError' ||
        err.name === 'TimeoutError' ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('Failed to fetch');

      if (isNetworkError) {
        const netErr = new Error('Cannot reach the server. Please check your connection.');
        netErr.response = { data: { detail: 'Cannot reach the server. Please check your connection.' } };
        throw netErr;
      }

      throw err; // Credential error from backend
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const MockAuthProvider = AuthProvider;
