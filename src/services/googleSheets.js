// Google Sheets integration for SAE membership data collection and management
const GOOGLE_SHEETS_CONFIG = {
  // Your Google Apps Script Web App URL (will be created)
  webAppUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  
  // Google Sheets API Configuration
  spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID || '',
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
  
  // Form configuration
  forms: {
    membership: {
      name: 'SAE TKMCE Membership Application',
      enabled: true,
      fields: [
        'fullName',
        'email', 
        'phone',
        'college',
        'department',
        'year',
        'interests',
        'experience',
        'motivation'
      ]
    }
  },

  // Sheet names for different data types
  sheets: {
    memberships: 'Memberships',
    membershipApplications: 'Membership_Applications',
    events: 'Event_Registrations',
    analytics: 'Analytics_Dashboard'
  }
};

export const googleSheetsService = {
  // Submit membership application to Google Sheets
  async submitMembershipApplication(formData) {
    try {
      console.log('📝 Submitting membership application...', formData);
      
      // Add timestamp and form type
      const submissionData = {
        ...formData,
        formType: 'membership',
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Application submitted successfully:', result);
      
      return {
        success: true,
        message: 'Application submitted successfully! We will contact you soon.',
        data: result
      };
      
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      
      // Fallback: Show manual contact info
      return {
        success: false,
        message: 'Please contact us directly at sae@tkmce.ac.in with your details.',
        error: error.message
      };
    }
  },

  // Validate form data
  validateMembershipForm(data) {
    const errors = [];
    
    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.push('Full name is required (minimum 2 characters)');
    }
    
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email address is required');
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
      errors.push('Valid phone number is required');
    }
    
    if (!data.college || data.college.trim().length < 2) {
      errors.push('College name is required');
    }
    
    if (!data.department || data.department.trim().length < 2) {
      errors.push('Department is required');
    }
    
    if (!data.year || !['1', '2', '3', '4'].includes(data.year)) {
      errors.push('Academic year is required');
    }
    
    return errors;
  },

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Get configuration
  getConfig() {
    return GOOGLE_SHEETS_CONFIG;
  },

  // === MEMBERSHIP MANAGEMENT FUNCTIONS ===

  /**
   * Initialize Google Sheets API for admin operations
   */
  async initializeAPI() {
    try {
      if (this.initialized) return true;

      // Load Google APIs
      if (!window.gapi) {
        await this.loadGoogleAPI();
      }

      // Initialize GAPI client
      await window.gapi.load('client:auth2', async () => {
        await window.gapi.client.init({
          apiKey: GOOGLE_SHEETS_CONFIG.apiKey,
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
      });

      this.initialized = true;
      console.log('Google Sheets API initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Sheets API:', error);
      return false;
    }
  },

  /**
   * Load Google API Script
   */
  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  /**
   * Sync membership data to Google Sheets
   */
  async syncMembershipData(membershipData) {
    try {
      // Try API method first, fallback to web app
      if (await this.initializeAPI()) {
        return await this.syncViaAPI(membershipData);
      } else {
        return await this.syncViaWebApp(membershipData);
      }
    } catch (error) {
      console.error('Error syncing membership data:', error);
      // Fallback to web app method
      return await this.syncViaWebApp(membershipData);
    }
  },

  /**
   * Sync via Google Sheets API
   */
  async syncViaAPI(membershipData) {
    const sheetData = this.formatMembershipData(membershipData);
    
    const response = await window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: `${GOOGLE_SHEETS_CONFIG.sheets.memberships}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [sheetData]
      }
    });

    console.log('Membership data synced via API:', response);
    return response;
  },

  /**
   * Sync via Web App (fallback method)
   */
  async syncViaWebApp(membershipData) {
    const submissionData = {
      ...membershipData,
      formType: 'membershipUpdate',
      action: 'sync',
      timestamp: new Date().toISOString()
    };

    const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Update membership status in Google Sheets
   */
  async updateMembershipStatus(membershipId, status, memberData = {}) {
    try {
      const updateData = {
        formType: 'membershipStatusUpdate',
        action: 'updateStatus',
        membershipId: membershipId,
        status: status,
        memberData: memberData,
        timestamp: new Date().toISOString(),
        updatedBy: 'admin_panel'
      };

      const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Updated membership ${membershipId} status to ${status}:`, result);
      return result;
    } catch (error) {
      console.error('Error updating membership status:', error);
      throw error;
    }
  },

  /**
   * Bulk sync memberships to Google Sheets
   */
  async bulkSyncMemberships(memberships) {
    try {
      const bulkData = {
        formType: 'membershipBulkSync',
        action: 'bulkSync',
        memberships: memberships.map(membership => this.formatMembershipData(membership)),
        timestamp: new Date().toISOString(),
        totalCount: memberships.length
      };

      const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bulkData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Bulk synced ${memberships.length} memberships:`, result);
      return result;
    } catch (error) {
      console.error('Error bulk syncing memberships:', error);
      throw error;
    }
  },

  /**
   * Format membership data for Google Sheets
   */
  formatMembershipData(membership) {
    return [
      membership.id || '',
      membership.first_name || '',
      membership.last_name || '',
      membership.email || '',
      membership.college_id || '',
      membership.branch || '',
      membership.year_of_study || '',
      membership.phone || '',
      membership.preferred_team || '',
      membership.date_joined || membership.created_at || '',
      membership.membership_status || '',
      new Date().toISOString(),
      membership.payment_status || 'pending',
      membership.renewal_date || '',
      membership.notes || ''
    ];
  },

  /**
   * Export memberships to CSV for Google Sheets import
   */
  exportToCSV(memberships) {
    const headers = [
      'Membership ID', 'First Name', 'Last Name', 'Email', 'College ID',
      'Branch', 'Year of Study', 'Phone', 'Preferred Team', 'Date Joined',
      'Status', 'Last Updated', 'Payment Status', 'Renewal Date', 'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...memberships.map(membership => {
        const data = this.formatMembershipData(membership);
        return data.map(field => `"${field}"`).join(',');
      })
    ].join('\n');

    // Create downloadable file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sae-memberships-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    console.log('Membership data exported to CSV');
  },

  /**
   * Setup Google Sheets for membership management
   */
  async setupMembershipTracking() {
    try {
      const setupData = {
        formType: 'setupMembershipTracking',
        action: 'setupSheets',
        timestamp: new Date().toISOString(),
        sheets: GOOGLE_SHEETS_CONFIG.sheets
      };

      const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setupData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Membership tracking setup completed:', result);
      return result;
    } catch (error) {
      console.error('Error setting up membership tracking:', error);
      throw error;
    }
  },

  /**
   * Get membership statistics from Google Sheets
   */
  async getMembershipStatistics() {
    try {
      const statsData = {
        formType: 'getMembershipStats',
        action: 'getStats',
        timestamp: new Date().toISOString()
      };

      const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statsData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting membership statistics:', error);
      return {};
    }
  }
};
