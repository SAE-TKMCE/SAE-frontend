import api from './api';

export const certificatesService = {
  async verifyCertificate(email, pin) {
    const response = await api.post('api/certificates/verify/', { email, pin });
    return response.data;
  },
};
