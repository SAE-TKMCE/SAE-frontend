import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import PaymentHistory from '../components/PaymentHistory';
import MembershipPlans from '../components/MembershipPlans';
import EventRegistration from '../components/EventRegistration';
import ManualPaymentModal from '../components/ManualPaymentModal';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('membership');
  const [paymentOptions, setPaymentOptions] = useState(null);
  const [paymentInstructions, setPaymentInstructions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [options, instructions] = await Promise.all([
        paymentService.getPaymentOptions(),
        paymentService.getPaymentInstructions()
      ]);
      setPaymentOptions(options);
      setPaymentInstructions(instructions);
    } catch (err) {
      setError('Failed to load payment data');
      console.error('Error loading payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSelect = (paymentData) => {
    setSelectedPayment(paymentData);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    // Refresh data after payment
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Manage your memberships and event registrations</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('membership')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'membership'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💳 Membership
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎫 Events
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Payment History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'membership' && (
            <MembershipPlans
              membershipTypes={paymentOptions?.membership_types || []}
              onPaymentSelect={handlePaymentSelect}
            />
          )}
          {activeTab === 'events' && (
            <EventRegistration
              events={paymentOptions?.events || []}
              onPaymentSelect={handlePaymentSelect}
            />
          )}
          {activeTab === 'history' && (
            <PaymentHistory />
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPayment && paymentInstructions && (
          <ManualPaymentModal
            paymentData={selectedPayment}
            paymentInstructions={paymentInstructions}
            onComplete={handlePaymentComplete}
            onCancel={() => setShowPaymentModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Payments;
