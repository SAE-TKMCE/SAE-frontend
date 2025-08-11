// Simple service to fetch form configurations from admin panel
const API_BASE_URL = 'http://localhost:8000/api';

export const formConfigService = {
  // Get all form configurations
  async getAllForms() {
    try {
      const response = await fetch(`${API_BASE_URL}/forms/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching forms:', error);
      return {};
    }
  },

  // Get specific form configuration
  async getForm(formType) {
    try {
      const response = await fetch(`${API_BASE_URL}/forms/${formType}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${formType} form:`, error);
      return null;
    }
  },

  // Open form in new tab
  openForm(embedUrl, formName = 'Registration Form') {
    if (!embedUrl) {
      alert('Form is not configured. Please contact administrator.');
      return;
    }

    // Convert embed URL to direct URL for better UX
    const directUrl = embedUrl.replace('/embed/', '/').replace('/form', '');
    
    // Try to open in new tab
    const newWindow = window.open(directUrl, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      // Fallback if popup blocked
      alert(`Please allow popups for this site, or visit: ${directUrl}`);
    }
  }
};
