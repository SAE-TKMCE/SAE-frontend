import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextMock';

const Membership = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Membership</h1>
          {user && (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Member Dashboard
            </Link>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600 mb-4">
            As a member of SAE TKMCE, you get access to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Digital Membership Card</li>
            <li>Event Certificates</li>
            <li>Exclusive Events Access</li>
            <li>Team Participation Opportunities</li>
            <li>Networking with Industry Professionals</li>
          </ul>
          {!user && (
            <div className="mt-6">
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join SAE TKMCE
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Membership;
