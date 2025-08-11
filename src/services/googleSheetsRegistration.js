/**
 * Google Sheets Registration Service
 * Handles registration data submission to Google Sheets via Google Apps Script Web App
 */

// Configuration - Update this URL after deploying your Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

class GoogleSheetsRegistrationService {
  /**
   * Submit registration data to Google Sheets
   * @param {Object} registrationData - The registration form data
   * @returns {Promise<Object>} Response from the server
   */
  async submitRegistration(registrationData) {
    console.log('📤 Submitting registration to Google Sheets:', registrationData);
    
    try {
      // Validate the data before sending
      this.validateRegistrationData(registrationData);
      
      // Prepare the data for Google Sheets
      const formattedData = this.formatRegistrationData(registrationData);
      
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'registration',
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
        console.log('✅ Registration submitted successfully:', result);
        return {
          success: true,
          message: 'Registration submitted successfully! We will review your application and contact you soon.',
          data: result
        };
      } else {
        throw new Error(result.error || 'Failed to submit registration');
      }
      
    } catch (error) {
      console.error('❌ Registration submission failed:', error);
      
      // Handle different types of errors
      if (error.name === 'ValidationError') {
        throw error;
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      throw new Error(error.message || 'Failed to submit registration. Please try again.');
    }
  }
  
  /**
   * Validate registration data
   * @param {Object} data - Registration data to validate
   */
  validateRegistrationData(data) {
    const requiredFields = [
      'first_name',
      'last_name', 
      'email',
      'phone',
      'college_id',
      'year_of_study',
      'branch'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
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
   * Format registration data for Google Sheets
   * @param {Object} data - Raw registration data
   * @returns {Object} Formatted data
   */
  formatRegistrationData(data) {
    return {
      // Personal Information
      firstName: data.first_name?.trim() || '',
      lastName: data.last_name?.trim() || '',
      fullName: `${data.first_name?.trim()} ${data.last_name?.trim()}`.trim(),
      email: data.email?.trim().toLowerCase() || '',
      phone: data.phone?.trim() || '',
      
      // Academic Information
      collegeId: data.college_id?.trim() || '',
      yearOfStudy: data.year_of_study || '',
      branch: data.branch || '',
      
      // SAE Information
      preferredTeam: data.preferred_team || 'No preference',
      interests: data.interests?.trim() || '',
      experience: data.experience?.trim() || '',
      skills: data.skills?.trim() || '',
      
      // Account Information (Note: Don't store actual password in sheets)
      username: data.username?.trim() || '',
      hasPassword: data.password ? 'Yes' : 'No',
      
      // Metadata
      submissionDate: new Date().toLocaleDateString('en-IN'),
      submissionTime: new Date().toLocaleTimeString('en-IN'),
      status: 'Pending Review',
      source: 'Website Registration Form'
    };
  }
  
  /**
   * Test the Google Sheets connection
   * @returns {Promise<boolean>} True if connection is working
   */
  async testConnection() {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          message: 'Testing connection from SAE website'
        }),
        mode: 'cors'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const googleSheetsRegistrationService = new GoogleSheetsRegistrationService();

export default googleSheetsRegistrationService;
export { GoogleSheetsRegistrationService };
