import api from './api';

export const eventsService = {
  async getEvents() {
    const response = await api.get('/events/');
    return response.data;
  },

  async getEvent(id) {
    const response = await api.get(`/events/${id}/`);
    return response.data;
  },

  async registerForEvent(id) {
    const response = await api.post(`/events/${id}/register/`);
    return response.data;
  },

  async getRegistrationForm(id) {
    const response = await api.get(`/events/${id}/registration-form/`);
    return response.data;
  },

  async getMyRegistrations() {
    const response = await api.get('/events/my-registrations/');
    return response.data;
  },
};
