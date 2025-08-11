import api from './api';

export const paymentService = {
  // Get payment options (membership types and events)
  async getPaymentOptions() {
    const response = await api.get('/payments/options/');
    return response.data;
  },

  // Get payment instructions and bank details
  async getPaymentInstructions() {
    const response = await api.get('/payments/payment-instructions/');
    return response.data;
  },

  // Submit manual payment with receipt
  async submitManualPayment(data) {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        if (key === 'receipt_image') {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await api.post('/payments/submit-payment/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's payment history
  async getMyPayments() {
    const response = await api.get('/payments/my-payments/');
    return response.data;
  },

  // Get specific payment details
  async getPaymentDetails(paymentId) {
    const response = await api.get(`/payments/payment/${paymentId}/`);
    return response.data;
  },

  // Format payment status with appropriate styling
  getStatusInfo(status) {
    switch (status) {
      case 'pending':
        return { color: 'yellow', icon: '⏳', text: 'Pending Approval' };
      case 'approved':
        return { color: 'green', icon: '✅', text: 'Approved' };
      case 'rejected':
        return { color: 'red', icon: '❌', text: 'Rejected' };
      case 'expired':
        return { color: 'gray', icon: '⏰', text: 'Expired' };
      default:
        return { color: 'gray', icon: '❓', text: 'Unknown' };
    }
  },

  // Format payment method display
  getPaymentMethodInfo(method) {
    switch (method) {
      case 'upi':
        return { icon: '📱', name: 'UPI Payment' };
      case 'bank_transfer':
        return { icon: '🏦', name: 'Bank Transfer' };
      case 'cash':
        return { icon: '💵', name: 'Cash Payment' };
      case 'cheque':
        return { icon: '📋', name: 'Cheque' };
      case 'dd':
        return { icon: '📄', name: 'Demand Draft' };
      default:
        return { icon: '💳', name: 'Payment' };
    }
  },

  // Validate payment form data
  validatePaymentData(data) {
    const errors = [];

    if (!data.payment_type) errors.push('Payment type is required');
    if (!data.amount || data.amount <= 0) errors.push('Valid amount is required');
    if (!data.payment_method) errors.push('Payment method is required');
    if (!data.receipt_image) errors.push('Receipt image is required');
    if (!data.payment_date) errors.push('Payment date is required');

    // Validate payment date is not in future
    if (data.payment_date && new Date(data.payment_date) > new Date()) {
      errors.push('Payment date cannot be in the future');
    }

    // Validate file type for receipt
    if (data.receipt_image) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(data.receipt_image.type)) {
        errors.push('Receipt must be a JPEG or PNG image');
      }
      
      // Check file size (max 5MB)
      if (data.receipt_image.size > 5 * 1024 * 1024) {
        errors.push('Receipt image must be less than 5MB');
      }
    }

    return errors;
  },

  // Admin functions (if needed for admin panel)
  admin: {
    async getPendingPayments() {
      const response = await api.get('/payments/admin/pending/');
      return response.data;
    },

    async approvePayment(paymentId, adminNotes) {
      const response = await api.post('/payments/admin/approve/', {
        payment_id: paymentId,
        action: 'approve',
        admin_notes: adminNotes || ''
      });
      return response.data;
    },

    async rejectPayment(paymentId, adminNotes) {
      const response = await api.post('/payments/admin/approve/', {
        payment_id: paymentId,
        action: 'reject',
        admin_notes: adminNotes || ''
      });
      return response.data;
    },

    async getStatistics() {
      const response = await api.get('/payments/admin/statistics/');
      return response.data;
    }
  }
};
