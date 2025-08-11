import React, { useState, useEffect } from 'react';

const AirtableModal = ({ isOpen, onClose, formUrl, formName = 'Registration Form', embedUrl = null }) => {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    if (isOpen && embedUrl) {
      setIsEmbedded(true);
    }
  }, [isOpen, embedUrl]);

  if (!isOpen) return null;

  const handleOpenInNewTab = () => {
    window.open(formUrl, '_blank');
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{formName}</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenInNewTab}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Open in New Tab</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {embedUrl && isEmbedded ? (
            <div className="w-full">
              <iframe 
                src={embedUrl}
                width="100%" 
                height="600" 
                frameBorder="0" 
                marginHeight="0" 
                marginWidth="0"
                className="border border-gray-200 rounded-lg"
                title={formName}
              >
                Loading form...
              </iframe>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Form</h3>
              <p className="text-gray-600 mb-6">
                Click the button below to open the registration form. No login required!
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleOpenInNewTab}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Open Registration Form</span>
                </button>
                <p className="text-xs text-gray-500">
                  Opens in a new tab • Free to join • No account needed
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirtableModal;
