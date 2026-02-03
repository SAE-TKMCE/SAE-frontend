import React from 'react';
import { motion } from 'framer-motion';

const CertificateCard = ({ certificate }) => {
  const {
    event_name,
    certificate_url,
    issue_date,
    certificate_id,
    is_valid,
    qr_code_url,
    verification_url
  } = certificate;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${event_name} Certificate`,
          text: `Verify my ${event_name} certificate from SAE TKMCE`,
          url: verification_url
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(verification_url);
        alert('Verification link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Preview */}
      <div className="relative aspect-video w-full bg-gray-100">
        {certificate_url ? (
          <img
            src={certificate_url}
            alt={`${event_name} Certificate`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Certificate Preview</span>
          </div>
        )}
        
        {/* Validity Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs text-white ${
          is_valid ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {is_valid ? 'Valid' : 'Invalid'}
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{event_name}</h3>
            <p className="text-sm text-gray-600">
              Issued on: {new Date(issue_date).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              Certificate ID: {certificate_id}
            </p>
          </div>
          {qr_code_url && (
            <div className="ml-4 flex-shrink-0">
              <img
                src={qr_code_url}
                alt="Verification QR Code"
                className="w-20 h-20 rounded-lg border border-gray-200"
              />
              <p className="text-xs text-gray-500 text-center mt-1">Scan to verify</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Download
          </a>
          <button
            onClick={() => window.open(`/verify-certificate/${certificate_id}`, '_blank')}
            className="px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors"
          >
            Verify
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;