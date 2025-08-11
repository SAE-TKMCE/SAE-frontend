/**
 * Mock Supabase Service for Development
 * Provides mock data and functions for development without requiring Supabase setup
 */

// Mock data
const mockMembers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    status: 'active',
    membership_type: 'student',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    status: 'pending',
    membership_type: 'faculty',
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T11:00:00Z'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1234567892',
    status: 'inactive',
    membership_type: 'alumni',
    created_at: '2024-01-17T12:00:00Z',
    updated_at: '2024-01-17T12:00:00Z'
  }
];

const mockEvents = [
  {
    id: 1,
    title: 'Tech Workshop 2024',
    description: 'Learn latest technologies',
    event_date: '2024-03-15T09:00:00Z',
    location: 'Main Hall',
    status: 'active',
    max_participants: 50,
    current_participants: 25,
    created_at: '2024-01-10T08:00:00Z'
  }
];

const mockFormTemplates = [
  {
    id: 1,
    name: 'Membership Registration',
    type: 'membership',
    description: 'Standard membership registration form',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Event Registration',
    type: 'event',
    description: 'Event registration form',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

const mockFormFields = [
  {
    id: 1,
    form_template_id: 1,
    field_type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    order_index: 0,
    is_active: true
  },
  {
    id: 2,
    form_template_id: 1,
    field_type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
    order_index: 1,
    is_active: true
  },
  {
    id: 3,
    form_template_id: 1,
    field_type: 'select',
    label: 'Membership Type',
    required: true,
    options: ['Student', 'Faculty', 'Alumni'],
    order_index: 2,
    is_active: true
  }
];

// Mock media assets
const mockMediaAssets = [
  {
    id: 1,
    filename: 'team-photo-2024.jpg',
    original_name: 'team-photo-2024.jpg',
    file_path: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    file_size: 2048576,
    mime_type: 'image/jpeg',
    category: 'events',
    tags: ['team', 'photo', '2024'],
    alt_text: 'SAE Team Photo 2024',
    uploaded_by: 'admin@sae.ac.in',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    filename: 'workshop-banner.png',
    original_name: 'workshop-banner.png',
    file_path: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    file_size: 1536000,
    mime_type: 'image/png',
    category: 'marketing',
    tags: ['workshop', 'banner', 'promotion'],
    alt_text: 'Workshop Promotion Banner',
    uploaded_by: 'admin@sae.ac.in',
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T11:00:00Z'
  },
  {
    id: 3,
    filename: 'project-showcase.jpg',
    original_name: 'project-showcase.jpg',
    file_path: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    file_size: 2560000,
    mime_type: 'image/jpeg',
    category: 'projects',
    tags: ['project', 'showcase', 'engineering'],
    alt_text: 'Student Project Showcase',
    uploaded_by: 'admin@sae.ac.in',
    created_at: '2024-01-17T12:00:00Z',
    updated_at: '2024-01-17T12:00:00Z'
  },
  {
    id: 4,
    filename: 'competition-winners.jpg',
    original_name: 'competition-winners.jpg',
    file_path: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    file_size: 1920000,
    mime_type: 'image/jpeg',
    category: 'achievements',
    tags: ['competition', 'winners', 'awards'],
    alt_text: 'Competition Winners 2024',
    uploaded_by: 'admin@sae.ac.in',
    created_at: '2024-01-18T13:00:00Z',
    updated_at: '2024-01-18T13:00:00Z'
  },
  {
    id: 5,
    filename: 'sae-logo-official.svg',
    original_name: 'sae-logo-official.svg',
    file_path: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiMzQjgyRjYiLz4KPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0FFPC90ZXh0Pgo8L3N2Zz4K',
    file_size: 2048,
    mime_type: 'image/svg+xml',
    category: 'logos',
    tags: ['logo', 'official', 'sae'],
    alt_text: 'SAE Official Logo',
    uploaded_by: 'admin@sae.ac.in',
    created_at: '2024-01-19T14:00:00Z',
    updated_at: '2024-01-19T14:00:00Z'
  }
];

// Mock Supabase client
export const supabase = {
  from: (table) => ({
    select: (columns = '*') => ({
      order: (column, options = {}) => ({
        then: (callback) => {
          setTimeout(() => {
            let data = [];
            switch (table) {
              case 'members':
                data = mockMembers;
                break;
              case 'events':
                data = mockEvents;
                break;
              case 'form_templates':
                data = mockFormTemplates;
                break;
              case 'form_fields':
                data = mockFormFields;
                break;
              case 'media_assets':
                data = mockMediaAssets;
                break;
              default:
                data = [];
            }
            callback({ data, error: null });
          }, 500);
          return Promise.resolve({ data: [], error: null });
        }
      }),
      eq: (column, value) => ({
        then: (callback) => {
          setTimeout(() => {
            let data = [];
            switch (table) {
              case 'form_fields':
                data = mockFormFields.filter(field => field.form_template_id === value);
                break;
              default:
                data = [];
            }
            callback({ data, error: null });
          }, 300);
          return Promise.resolve({ data: [], error: null });
        }
      })
    }),
    insert: (values) => ({
      select: () => ({
        then: (callback) => {
          setTimeout(() => {
            const newItem = {
              id: Date.now(),
              ...values,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            callback({ data: [newItem], error: null });
          }, 300);
          return Promise.resolve({ data: [], error: null });
        }
      })
    }),
    update: (values) => ({
      eq: (column, value) => ({
        select: () => ({
          then: (callback) => {
            setTimeout(() => {
              callback({ data: [{ id: value, ...values }], error: null });
            }, 300);
            return Promise.resolve({ data: [], error: null });
          }
        })
      })
    }),
    delete: () => ({
      eq: (column, value) => ({
        then: (callback) => {
          setTimeout(() => {
            callback({ data: null, error: null });
          }, 300);
          return Promise.resolve({ data: null, error: null });
        }
      })
    })
  })
};

// Database table names
export const TABLES = {
  MEMBERS: 'members',
  EVENTS: 'events',
  EVENT_REGISTRATIONS: 'event_registrations',
  FORM_FIELDS: 'form_fields',
  FORM_TEMPLATES: 'form_templates',
  ADMIN_USERS: 'admin_users',
  SETTINGS: 'settings',
  MEDIA_ASSETS: 'media_assets'
};

// Helper function to simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Admin service for member management
export const adminService = {
  // Member Management
  async getAllMembers() {
    await delay(500);
    return [...mockMembers];
  },

  async updateMemberStatus(memberId, status) {
    await delay(300);
    const member = mockMembers.find(m => m.id === memberId);
    if (member) {
      member.status = status;
      member.updated_at = new Date().toISOString();
      return member;
    }
    throw new Error('Member not found');
  },

  async bulkUpdateMemberStatus(memberIds, status) {
    await delay(500);
    const updatedMembers = [];
    memberIds.forEach(id => {
      const member = mockMembers.find(m => m.id === id);
      if (member) {
        member.status = status;
        member.updated_at = new Date().toISOString();
        updatedMembers.push(member);
      }
    });
    return updatedMembers;
  },

  async createMember(memberData) {
    await delay(300);
    const newMember = {
      id: Date.now(),
      ...memberData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockMembers.push(newMember);
    return newMember;
  },

  async updateMember(memberId, memberData) {
    await delay(300);
    const memberIndex = mockMembers.findIndex(m => m.id === memberId);
    if (memberIndex !== -1) {
      mockMembers[memberIndex] = {
        ...mockMembers[memberIndex],
        ...memberData,
        updated_at: new Date().toISOString()
      };
      return mockMembers[memberIndex];
    }
    throw new Error('Member not found');
  },

  async deleteMember(memberId) {
    await delay(300);
    const memberIndex = mockMembers.findIndex(m => m.id === memberId);
    if (memberIndex !== -1) {
      mockMembers.splice(memberIndex, 1);
      return true;
    }
    throw new Error('Member not found');
  },

  // Event Management
  async getAllEvents() {
    await delay(500);
    return [...mockEvents];
  },

  async createEvent(eventData) {
    await delay(300);
    const newEvent = {
      id: Date.now(),
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  // Form Management
  async getFormTemplates() {
    await delay(400);
    return [...mockFormTemplates];
  },

  async createFormTemplate(templateData) {
    await delay(300);
    const newTemplate = {
      id: Date.now(),
      ...templateData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockFormTemplates.push(newTemplate);
    return newTemplate;
  },

  async deleteFormTemplate(templateId) {
    await delay(300);
    const templateIndex = mockFormTemplates.findIndex(t => t.id === templateId);
    if (templateIndex !== -1) {
      mockFormTemplates.splice(templateIndex, 1);
      return true;
    }
    throw new Error('Template not found');
  },

  async getFormFields(templateId) {
    await delay(400);
    if (templateId) {
      return mockFormFields.filter(field => field.form_template_id === templateId);
    }
    return [...mockFormFields];
  },

  async createFormField(fieldData) {
    await delay(300);
    const newField = {
      id: Date.now(),
      ...fieldData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockFormFields.push(newField);
    return newField;
  },

  async updateFormField(fieldId, fieldData) {
    await delay(300);
    const fieldIndex = mockFormFields.findIndex(f => f.id === fieldId);
    if (fieldIndex !== -1) {
      mockFormFields[fieldIndex] = {
        ...mockFormFields[fieldIndex],
        ...fieldData,
        updated_at: new Date().toISOString()
      };
      return mockFormFields[fieldIndex];
    }
    throw new Error('Field not found');
  },

  async deleteFormField(fieldId) {
    await delay(300);
    const fieldIndex = mockFormFields.findIndex(f => f.id === fieldId);
    if (fieldIndex !== -1) {
      mockFormFields.splice(fieldIndex, 1);
      return true;
    }
    throw new Error('Field not found');
  },

  // Media Management
  async getMediaAssets(filters = {}) {
    await delay(500);
    let assets = [...mockMediaAssets];
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      assets = assets.filter(asset => asset.category === filters.category);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      assets = assets.filter(asset => 
        asset.filename.toLowerCase().includes(searchTerm) ||
        asset.original_name.toLowerCase().includes(searchTerm) ||
        asset.alt_text.toLowerCase().includes(searchTerm) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    return assets;
  },

  async uploadMediaAsset(assetData) {
    await delay(800);
    const newAsset = {
      id: Date.now(),
      filename: assetData.filename || `file_${Date.now()}`,
      original_name: assetData.original_name || assetData.filename,
      file_path: assetData.file_path || `https://images.unsplash.com/photo-${Date.now()}?w=800`,
      file_size: assetData.file_size || 1024000,
      mime_type: assetData.mime_type || 'image/jpeg',
      category: assetData.category || 'general',
      tags: assetData.tags || [],
      alt_text: assetData.alt_text || '',
      uploaded_by: 'admin@sae.ac.in',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockMediaAssets.push(newAsset);
    return newAsset;
  },

  async updateMediaAsset(assetId, updateData) {
    await delay(300);
    const assetIndex = mockMediaAssets.findIndex(a => a.id === assetId);
    if (assetIndex !== -1) {
      mockMediaAssets[assetIndex] = {
        ...mockMediaAssets[assetIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      };
      return mockMediaAssets[assetIndex];
    }
    throw new Error('Media asset not found');
  },

  async deleteMediaAsset(assetId) {
    await delay(300);
    const assetIndex = mockMediaAssets.findIndex(a => a.id === assetId);
    if (assetIndex !== -1) {
      mockMediaAssets.splice(assetIndex, 1);
      return true;
    }
    throw new Error('Media asset not found');
  },

  async bulkDeleteMediaAssets(assetIds) {
    await delay(500);
    const deletedAssets = [];
    assetIds.forEach(id => {
      const assetIndex = mockMediaAssets.findIndex(a => a.id === id);
      if (assetIndex !== -1) {
        deletedAssets.push(mockMediaAssets.splice(assetIndex, 1)[0]);
      }
    });
    return deletedAssets;
  },

  // Analytics for media
  async getMediaAnalytics() {
    await delay(400);
    const totalAssets = mockMediaAssets.length;
    const categoryCounts = mockMediaAssets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {});
    
    const totalSize = mockMediaAssets.reduce((sum, asset) => sum + asset.file_size, 0);
    
    return {
      totalAssets,
      categoryCounts,
      totalSize,
      recentUploads: mockMediaAssets
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
    };
  },

  // Event Registrations
  async getAllEventRegistrations() {
    await delay(300);
    // Mock event registrations
    return [
      {
        id: 1,
        event_id: 1,
        user_email: 'student1@example.com',
        user_name: 'Student One',
        registration_date: '2024-01-20T10:00:00Z',
        status: 'confirmed'
      },
      {
        id: 2,
        event_id: 1,
        user_email: 'student2@example.com',
        user_name: 'Student Two',
        registration_date: '2024-01-21T11:00:00Z',
        status: 'pending'
      },
      {
        id: 3,
        event_id: 2,
        user_email: 'student3@example.com',
        user_name: 'Student Three',
        registration_date: '2024-01-22T12:00:00Z',
        status: 'confirmed'
      }
    ];
  },

  // Recent Activity
  async getRecentActivity() {
    await delay(300);
    // Mock recent activity
    return [
      {
        id: 1,
        type: 'member_registration',
        title: 'New member registered',
        description: 'John Doe joined as a student member',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        user: 'John Doe'
      },
      {
        id: 2,
        type: 'event_created',
        title: 'New event created',
        description: 'Tech Workshop 2024 has been created',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        user: 'SAE Admin'
      },
      {
        id: 3,
        type: 'media_upload',
        title: 'Media uploaded',
        description: 'team-photo-2024.jpg uploaded to events category',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        user: 'SAE Admin'
      },
      {
        id: 4,
        type: 'member_approved',
        title: 'Member approved',
        description: 'Jane Smith membership approved',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        user: 'SAE Admin'
      },
      {
        id: 5,
        type: 'form_created',
        title: 'Form template created',
        description: 'Event Registration Form template created',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        user: 'SAE Admin'
      }
    ];
  },

  // Authentication
  async login(email, password) {
    await delay(1000);
    if (email === 'admin@sae.com' && password === 'admin123') {
      return {
        user: {
          id: 1,
          email: 'admin@sae.com',
          name: 'SAE Admin'
        },
        session: {
          access_token: 'mock_token_' + Date.now()
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  async logout() {
    await delay(300);
    return true;
  },

  async getCurrentUser() {
    await delay(200);
    return {
      id: 1,
      email: 'admin@sae.com',
      name: 'SAE Admin'
    };
  }
};

console.log('🚀 Mock Supabase service loaded for development');
