const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class AirtableService {
  async getAirtableForms() {
    try {
      const response = await fetch(`${API_BASE_URL}/config/airtable-forms/`);
      if (!response.ok) {
        throw new Error('Failed to fetch Airtable forms');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Airtable forms:', error);
      return {};
    }
  }

  async getAirtableForm(formType) {
    try {
      const response = await fetch(`${API_BASE_URL}/config/airtable-forms/${formType}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Airtable form: ${formType}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching Airtable form ${formType}:`, error);
      return null;
    }
  }

  openAirtableForm(url, formName = 'Registration Form') {
    // Open Airtable form in a new window/tab
    const popup = window.open(
      url,
      'airtable-form',
      'width=800,height=900,scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no'
    );
    
    if (!popup) {
      // If popup was blocked, open in same tab
      window.open(url, '_blank');
    }
    
    return popup;
  }

  embedAirtableForm(embedUrl, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !embedUrl) return;

    container.innerHTML = `
      <iframe 
        src="${embedUrl}" 
        width="100%" 
        height="600" 
        frameborder="0" 
        marginheight="0" 
        marginwidth="0"
        style="background: transparent; border: 1px solid #ccc; border-radius: 8px;">
        Loading…
      </iframe>
    `;
  }
}

export const airtableService = new AirtableService();
