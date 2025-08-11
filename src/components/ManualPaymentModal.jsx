import React, { useState, useRef } from 'react';
import { paymentService } from '../services/paymentService';

const ManualPaymentModal = ({ paymentData, paymentInstructions, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceipt(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMethod || !receipt || !transactionId) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('receipt', receipt);
      formData.append('payment_method', selectedMethod);
      formData.append('transaction_id', transactionId);
      formData.append('amount', paymentData.amount);
      formData.append('type', paymentData.type);
      if (paymentData.item_id) {
        formData.append('item_id', paymentData.item_id);
      }

      const response = await paymentService.submitManualPayment(formData);
      
      if (response.success) {
        onSuccess && onSuccess(response.data);
        onClose();
      } else {
        alert('Payment submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Payment submission failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!paymentInstructions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Loading...</h2>
          <p>Loading payment instructions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manual Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Details</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Amount:</span>
                <p className="font-semibold">₹{paymentData.amount}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <p className="font-semibold capitalize">{paymentData.type}</p>
              </div>
            </div>
            {paymentData.description && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Description:</span>
                <p className="font-semibold">{paymentData.description}</p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900">Choose Payment Method:</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {paymentInstructions.payment_methods && paymentInstructions.payment_methods.map((method) => (
                <div
                  key={method.method}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedMethod === method.method
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.method)}
                >
                  <h4 className="font-medium">{method.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{method.details}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedMethod && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-3">Payment Instructions</h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                {paymentInstructions.instructions && paymentInstructions.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID *
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter transaction ID from your payment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Receipt *
            </label>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Choose File
              </button>
              {receipt && (
                <span className="text-sm text-gray-600">
                  {receipt.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a screenshot or PDF of your payment receipt
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedMethod || !receipt || !transactionId || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Submitting...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualPaymentModal;
