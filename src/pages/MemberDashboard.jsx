import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { membershipService } from '../services/membership';
import MembershipCard from '../components/membership/MembershipCard';
import CertificateCard from '../components/membership/CertificateCard';
import Breadcrumb from '../components/layout/Breadcrumb';

const MemberDashboard = () => {
  const [membershipCard, setMembershipCard] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch membership card and certificates in parallel
        const [cardData, certificatesData] = await Promise.all([
          membershipService.getMyCard(),
          membershipService.getMyCertificates()
        ]);

        setMembershipCard(cardData);
        setCertificates(certificatesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your membership and certificates
          </p>
        </div>

        {/* Membership Card Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Digital Membership Card
            </h2>
            {membershipCard && (
              <button
                onClick={() => {
                  const url = `${window.location.origin}/verify-member/${membershipCard.card_number}`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'SAE TKMCE Membership Card',
                      text: 'Verify my SAE TKMCE membership',
                      url: url
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(url);
                    alert('Verification link copied to clipboard!');
                  }
                }}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Card
              </button>
            )}
          </div>
          
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6">
            <div className="flex-1 w-full lg:w-auto flex justify-center">
              {membershipCard ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <MembershipCard cardData={membershipCard} />
                </motion.div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center w-full">
                  <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Membership Card</h3>
                  <p className="text-gray-500 mb-6">
                    Please contact the administrator to get your digital membership card.
                  </p>
                  <a
                    href="mailto:admin@sae.tkmce.ac.in"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contact Admin
                  </a>
                </div>
              )}
            </div>

            {membershipCard && (
              <div className="w-full lg:w-72 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Card Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Member ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{membershipCard.card_number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(membershipCard.expiry_date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        membershipCard.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {membershipCard.is_active ? 'Active' : 'Expired'}
                      </span>
                    </dd>
                  </div>
                  {membershipCard.qr_code && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-2">Verification QR</dt>
                      <dd className="mt-1">
                        <img
                          src={membershipCard.qr_code}
                          alt="Membership verification QR code"
                          className="w-32 h-32 mx-auto"
                        />
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Scan to verify membership
                        </p>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Certificates Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              My Certificates
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {certificates.length} {certificates.length === 1 ? 'Certificate' : 'Certificates'}
              </span>
              <select
                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  // Sort certificates based on selection
                  const sorted = [...certificates].sort((a, b) => {
                    switch(e.target.value) {
                      case 'date-desc':
                        return new Date(b.issue_date) - new Date(a.issue_date);
                      case 'date-asc':
                        return new Date(a.issue_date) - new Date(b.issue_date);
                      case 'name':
                        return a.event_name.localeCompare(b.event_name);
                      default:
                        return 0;
                    }
                  });
                  setCertificates(sorted);
                }}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name">Event Name</option>
              </select>
            </div>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {certificates.map((certificate) => (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CertificateCard certificate={certificate} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
              <p className="text-gray-500 mb-6">
                Participate in SAE TKMCE events to earn certificates!
              </p>
              <Link
                to="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;