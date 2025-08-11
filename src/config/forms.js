// Simple form configuration - easily editable
export const FORM_CONFIGS = {
  // Membership Registration Form
  membership: {
    name: 'Membership Registration',
    embedUrl: 'https://airtable.com/embed/appCYqwtjNu47qKb8/pagUoOCii6OPMWPZd/form',
    directUrl: 'https://airtable.com/appCYqwtjNu47qKb8/pagUoOCii6OPMWPZd/form',
    enabled: true
  },
  
  // Event Registration Form
  event: {
    name: 'Event Registration', 
    embedUrl: 'https://airtable.com/embed/YOUR_EVENT_FORM_URL', // UPDATE THIS
    directUrl: 'https://airtable.com/YOUR_EVENT_FORM_URL', // UPDATE THIS
    enabled: false // Set to true when you add your event form URL
  }
};

// Service to handle form operations
export const formService = {
  // Get form configuration
  getForm(formType) {
    return FORM_CONFIGS[formType];
  },

  // Open form in new tab
  openForm(formType) {
    console.log('🔵 openForm called with formType:', formType);
    const config = FORM_CONFIGS[formType];
    console.log('🔵 Form config:', config);
    
    if (!config || !config.enabled) {
      console.log('❌ Form not available or disabled');
      alert(`${formType} registration form is not available. Please contact administrator.`);
      return;
    }

    console.log('🔵 Opening URL:', config.directUrl);
    // Try to open in new tab
    const newWindow = window.open(config.directUrl, '_blank', 'noopener,noreferrer');
    console.log('🔵 New window object:', newWindow);
    
    if (!newWindow) {
      console.log('❌ Popup blocked');
      // Fallback if popup blocked
      if (window.confirm(`Popup was blocked. Open ${config.name} form in this tab?`)) {
        window.location.href = config.directUrl;
      }
    } else {
      console.log('✅ Form opened successfully');
    }
  },

  // Check if form is available
  isFormAvailable(formType) {
    const config = FORM_CONFIGS[formType];
    return config && config.enabled;
  }
};
