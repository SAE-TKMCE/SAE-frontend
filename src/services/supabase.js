/**
 * Supabase Configuration
 * Handles database connections and authentication
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Admin service for member management
export const adminService = {
  // Member Management
  async getAllMembers() {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateMemberStatus(memberId, status) {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteMember(memberId) {
    const { error } = await supabase
      .from(TABLES.MEMBERS)
      .delete()
      .eq('id', memberId);
    
    if (error) throw error;
    return true;
  },

  // Form Field Management
  async getFormFields(formType = 'membership') {
    const { data, error } = await supabase
      .from(TABLES.FORM_FIELDS)
      .select('*')
      .eq('form_type', formType)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createFormField(fieldData) {
    const { data, error } = await supabase
      .from(TABLES.FORM_FIELDS)
      .insert(fieldData)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateFormField(fieldId, fieldData) {
    const { data, error } = await supabase
      .from(TABLES.FORM_FIELDS)
      .update(fieldData)
      .eq('id', fieldId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteFormField(fieldId) {
    const { error } = await supabase
      .from(TABLES.FORM_FIELDS)
      .delete()
      .eq('id', fieldId);
    
    if (error) throw error;
    return true;
  },

  // Event Management
  async getAllEvents() {
    const { data, error } = await supabase
      .from(TABLES.EVENTS)
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createEvent(eventData) {
    const { data, error } = await supabase
      .from(TABLES.EVENTS)
      .insert(eventData)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateEvent(eventId, eventData) {
    const { data, error } = await supabase
      .from(TABLES.EVENTS)
      .update(eventData)
      .eq('id', eventId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteEvent(eventId) {
    const { error } = await supabase
      .from(TABLES.EVENTS)
      .delete()
      .eq('id', eventId);
    
    if (error) throw error;
    return true;
  },

  // Event Registration Management
  async getEventRegistrations(eventId = null) {
    let query = supabase
      .from(TABLES.EVENT_REGISTRATIONS)
      .select(`
        *,
        events (
          title,
          date,
          venue
        )
      `)
      .order('created_at', { ascending: false });

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateRegistrationStatus(registrationId, status) {
    const { data, error } = await supabase
      .from(TABLES.EVENT_REGISTRATIONS)
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', registrationId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Settings Management
  async getSettings() {
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .select('*');
    
    if (error) throw error;
    return data.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  },

  async updateSetting(key, value) {
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .upsert({ 
        key: key, 
        value: value,
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Media Management
  async getMediaAssets() {
    const { data, error } = await supabase
      .from(TABLES.MEDIA_ASSETS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createMediaAsset(assetData) {
    const { data, error } = await supabase
      .from(TABLES.MEDIA_ASSETS)
      .insert(assetData)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

// Authentication helpers
export const authService = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async isAdmin(userId) {
    const { data, error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};

export default supabase;
