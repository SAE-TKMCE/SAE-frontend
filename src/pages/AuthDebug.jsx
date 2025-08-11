import React from 'react';
import { useAuth } from '../contexts/AuthContextMock';

const AuthDebug = () => {
  const { user, login, logout, loading, isAuthenticated, isAdmin } = useAuth();

  const testLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Authentication Debug Panel</h1>
          
          {/* Current Auth Status */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Authentication Status</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Login (Test Accounts)</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">Admin Account</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Email: admin@sae.ac.in<br/>
                  Password: admin123
                </p>
                <button
                  onClick={() => testLogin('admin@sae.ac.in', 'admin123')}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login as Admin'}
                </button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">Member Account</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Email: user@sae.ac.in<br/>
                  Password: user123
                </p>
                <button
                  onClick={() => testLogin('user@sae.ac.in', 'user123')}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login as Member'}
                </button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-purple-600 mb-2">Test Account</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Email: test@test.com<br/>
                  Password: test123
                </p>
                <button
                  onClick={() => testLogin('test@test.com', 'test123')}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login as Test User'}
                </button>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          {user && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Logout</h2>
              <button
                onClick={logout}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Navigation</h2>
            <div className="flex flex-wrap gap-2">
              <a href="/login" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                Login Page
              </a>
              <a href="/register" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                Register Page
              </a>
              <a href="/admin" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                Admin Panel
              </a>
              <a href="/profile" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                Profile
              </a>
              <a href="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                Home
              </a>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">How to Test Login</h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Use any of the quick login buttons above</li>
              <li>Or go to the Login page and use the credentials shown</li>
              <li>Check the authentication status in the panel above</li>
              <li>Try accessing protected routes like /admin</li>
              <li>Test logout functionality</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
