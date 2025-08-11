/**
 * Google Sheets Event Registration Service
 * Handles event registration data submission to Google Sheets via Google Apps Script Web App
 */

// Configuration - Update this URL after deploying your Google Apps Script for event registrations
const GOOGLE_APPS_SCRIPT_EVENT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_EVENT_WEB_APP_URL_HERE';

class GoogleSheetsEventRegistrationService {
  /**
   * Submit event registration data to Google Sheets
   * @param {Object} registrationData - The event registration form data
   * @returns {Promise<Object>} Response from the server
   */
  async submitEventRegistration(registrationData) {
    console.log('📤 Submitting event registration to Google Sheets:', registrationData);
    
    try {
      // Validate the data before sending
      this.validateEventRegistrationData(registrationData);
      
      // Prepare the data for Google Sheets
      const formattedData = this.formatEventRegistrationData(registrationData);
      
      const response = await fetch(GOOGLE_APPS_SCRIPT_EVENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'event_registration',
          data: formattedData,
          timestamp: new Date().toISOString()
        }),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Event registration submitted successfully:', result);
        return {
          success: true,
          message: 'Event registration submitted successfully! We will contact you with payment details and confirmation.',
          data: result
        };
      } else {
        throw new Error(result.error || 'Failed to submit event registration');
      }
      
    } catch (error) {
      console.error('❌ Event registration submission error:', error);
      
      if (error.name === 'ValidationError') {
        throw error;
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      throw new Error(error.message || 'Failed to submit event registration. Please try again.');
    }
  }
  
  /**
   * Validate event registration data
   * @param {Object} data - Event registration data to validate
   */
  validateEventRegistrationData(data) {
    const requiredFields = [
      'event_id',
      'event_title',
      'participant_name',
      'email',
      'phone',
      'college_id',
      'year_of_study',
      'branch'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
      error.name = 'ValidationError';
      throw error;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      const error = new Error('Please enter a valid email address');
      error.name = 'ValidationError';
      throw error;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      const error = new Error('Please enter a valid phone number');
      error.name = 'ValidationError';
      throw error;
    }
  }
  
  /**
   * Format event registration data for Google Sheets
   * @param {Object} data - Raw event registration data
   * @returns {Object} Formatted data
   */
  formatEventRegistrationData(data) {
    return {
      // Event Information
      eventId: data.event_id?.toString() || '',
      eventTitle: data.event_title?.trim() || '',
      eventDate: data.event_date?.trim() || '',
      eventVenue: data.event_venue?.trim() || '',
      eventType: data.event_type?.trim() || '',
      
      // Participant Information
      participantName: data.participant_name?.trim() || '',
      email: data.email?.trim().toLowerCase() || '',
      phone: data.phone?.trim() || '',
      
      // Academic Information
      collegeId: data.college_id?.trim() || '',
      yearOfStudy: data.year_of_study?.toString() || '',
      branch: data.branch?.trim() || '',
      
      // Registration Details
      teamSize: data.team_size?.toString() || '1',
      teamMembers: data.team_members?.trim() || '',
      dietaryRequirements: data.dietary_requirements?.trim() || '',
      emergencyContact: data.emergency_contact?.trim() || '',
      previousExperience: data.previous_experience?.trim() || '',
      expectations: data.expectations?.trim() || '',
      
      // Payment Information
      registrationFee: data.registration_fee?.toString() || '0',
      memberFee: data.member_fee?.toString() || '0',
      isMember: data.is_member || false,
      paymentMethod: data.payment_method?.trim() || '',
      
      // Metadata
      submissionDate: new Date().toLocaleDateString('en-IN'),
      submissionTime: new Date().toLocaleTimeString('en-IN'),
      status: 'Pending Review',
      source: 'Website Event Registration Form',
      ipAddress: '', // Can be added if needed
      userAgent: navigator.userAgent || ''
    };
  }
  
  /**
   * Check if Google Apps Script URL is configured
   * @returns {boolean} True if URL is configured
   */
  isConfigured() {
    return GOOGLE_APPS_SCRIPT_EVENT_URL && 
           GOOGLE_APPS_SCRIPT_EVENT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_EVENT_WEB_APP_URL_HERE';
  }
  
  /**
   * Get configuration status message
   * @returns {string} Configuration status message
   */
  getConfigurationMessage() {
    if (!this.isConfigured()) {
      return 'Event registration system is not yet configured. Please set up Google Apps Script URL.';
    }
    return 'Event registration system is ready.';
  }
}

// Export singleton instance
const googleSheetsEventRegistrationService = new GoogleSheetsEventRegistrationService();
export default googleSheetsEventRegistrationService;
