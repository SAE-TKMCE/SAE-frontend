import api from './api';

export const certificatesService = {
  async verifyCertificate(email, pin) {
    const response = await api.post('api/certificates/verify/', { email, pin });
    return response.data;
  },
  async downloadCertificate(certificateId) {
    // This assumes the backend endpoint is: api/certificates/download/<certificateId>/
    const response = await api.get(`api/certificates/download/${certificateId}/`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
