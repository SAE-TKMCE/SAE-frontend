import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { membershipService } from '../services/membership';

const CertificateVerification = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState(certificateId || '');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await membershipService.verifyCertificate(searchId);
      setCertificate(data);
      // Update URL with certificate ID
      if (!certificateId) {
        navigate(`/verify-certificate/${searchId}`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify certificate');
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Certificate Verification
          </h1>
          <p className="mt-2 text-gray-600">
            Verify the authenticity of SAE TKMCE certificates
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div>
              <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700">
                Certificate ID
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="certificateId"
                  id="certificateId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter certificate ID"
                  className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Details */}
        {certificate && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Certificate Header */}
            <div className={`px-6 py-4 border-b ${
              certificate.is_valid 
                ? 'bg-green-50 border-green-100' 
                : 'bg-red-50 border-red-100'
            }`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  certificate.is_valid 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {certificate.is_valid ? (
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-medium ${
                    certificate.is_valid 
                      ? 'text-green-800' 
                      : 'text-red-800'
                  }`}>
                    {certificate.is_valid ? 'Valid Certificate' : 'Invalid Certificate'}
                  </h3>
                  <p className={`text-sm ${
                    certificate.is_valid 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    Certificate ID: {certificate.certificate_id}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Content */}
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Event Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{certificate.event_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(certificate.issue_date).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Recipient</dt>
                  <dd className="mt-1 text-sm text-gray-900">{certificate.user_name}</dd>
                </div>
                {certificate.certificate_url && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Certificate Preview</dt>
                    <dd className="mt-1">
                      <img 
                        src={certificate.certificate_url} 
                        alt="Certificate" 
                        className="w-full rounded-lg shadow-sm"
                      />
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification;