import api from './api';

export const eventsService = {
  async getEvents() {
    const response = await api.get('/events/');
    const data = response.data || [];
    return data.map(normalizeEvent);
  },

  async getEvent(id) {
    const response = await api.get(`/events/${id}/`);
    const data = response.data;
    return normalizeEvent(data);
  },

  async registerForEvent(id) {
    const response = await api.post(`/events/${id}/register/`);
    return response.data;
  },

  async getMyRegistrations() {
    const response = await api.get('/events/my-registrations/');
    return response.data;
  },
};

function normalizeEvent(event) {
  if (!event) return event;
  // ensure images is an array
  if (!Array.isArray(event.images)) {
    // sometimes backend may return a single string in `images`
    if (typeof event.images === 'string' && event.images.length) {
      event.images = [event.images];
    } else {
      event.images = [];
    }
  }

  // prefer explicit image_url, else first images[], else legacy image
  if (!event.image_url) {
    if (event.images && event.images.length) {
      event.image_url = event.images[0];
    } else if (event.image) {
      event.image_url = event.image;
    } else {
      event.image_url = null;
    }
  }

  // For older components expecting `image`, populate it from image_url
  if (!event.image) {
    event.image = event.image_url || null;
  }

  return event;
}
