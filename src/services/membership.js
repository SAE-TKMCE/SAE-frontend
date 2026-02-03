import api from './api';

export const membershipService = {
  // Digital Membership Card
  getMyCard: async () => {
    try {
      const response = await api.get('/membership/api/membership-cards/my-card/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyCard: async (cardNumber) => {
    try {
      const response = await api.post(`/membership/api/membership-cards/${cardNumber}/verify/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadProfilePhoto: async (cardId, photoFile) => {
    const formData = new FormData();
    formData.append('profile_photo', photoFile);
    
    try {
      const response = await api.patch(
        `/membership/api/membership-cards/${cardId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Certificates
  getMyCertificates: async () => {
    try {
      const response = await api.get('/membership/api/certificates/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCertificate: async (certificateId) => {
    try {
      const response = await api.get(`/membership/api/certificates/${certificateId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyCertificate: async (certificateId) => {
    try {
      const response = await api.get(`/membership/api/certificates/${certificateId}/verify/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};