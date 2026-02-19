import api from './api';

export const certificatesService = {
  async verifyCertificate(email, pin) {
    const response = await api.post('/certificates/verify/', { email, pin });
    return response.data;
  },
};
