import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/supabaseMock';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'users', name: 'Admin Users', icon: '👤' },
    { id: 'backup', name: 'Backup', icon: '💾' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSettings();
      
      // Convert array to object for easier manipulation
      const settingsObj = {};
      data.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      
      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Single-setting save handled via bulk save for now

  const handleBulkSave = async (settingsToSave) => {
    try {
      setSaving(true);
      
      const promises = Object.entries(settingsToSave).map(([key, value]) =>
        adminService.updateSetting(key, value)
      );
      
      await Promise.all(promises);
      setSettings(prev => ({ ...prev, ...settingsToSave }));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <span className="text-red-400 mr-2">⚠️</span>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchSettings}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure system settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralSettings
              settings={settings}
              onSave={handleBulkSave}
              saving={saving}
            />
          )}
          
          {activeTab === 'email' && (
            <EmailSettings
              settings={settings}
              onSave={handleBulkSave}
              saving={saving}
            />
          )}
          
          {activeTab === 'integrations' && (
            <IntegrationsSettings
              settings={settings}
              onSave={handleBulkSave}
              saving={saving}
            />
          )}
          
          {activeTab === 'users' && (
            <AdminUsersSettings />
          )}
          
          {activeTab === 'backup' && (
            <BackupSettings />
          )}
        </div>
      </div>
    </div>
  );
};

// General Settings Component
const GeneralSettings = ({ settings, onSave, saving }) => {
  const [formData, setFormData] = useState({
    site_name: settings.site_name || 'SAE TKMCE',
    site_description: settings.site_description || 'Society of Automotive Engineers',
    contact_email: settings.contact_email || 'contact@saetkmce.org',
    phone_number: settings.phone_number || '',
    address: settings.address || '',
    timezone: settings.timezone || 'Asia/Kolkata',
    date_format: settings.date_format || 'DD/MM/YYYY',
    auto_approve_members: settings.auto_approve_members === 'true',
    require_email_verification: settings.require_email_verification === 'true',
    max_file_size: settings.max_file_size || '10',
    allowed_file_types: settings.allowed_file_types || 'jpg,jpeg,png,pdf,doc,docx'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const settingsToSave = {
      ...formData,
      auto_approve_members: formData.auto_approve_members.toString(),
      require_email_verification: formData.require_email_verification.toString()
    };
    onSave(settingsToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Name
          </label>
          <input
            type="text"
            value={formData.site_name}
            onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Description
        </label>
        <textarea
          value={formData.site_description}
          onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max File Size (MB)
          </label>
          <input
            type="number"
            value={formData.max_file_size}
            onChange={(e) => setFormData({ ...formData, max_file_size: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Format
          </label>
          <select
            value={formData.date_format}
            onChange={(e) => setFormData({ ...formData, date_format: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Allowed File Types (comma separated)
        </label>
        <input
          type="text"
          value={formData.allowed_file_types}
          onChange={(e) => setFormData({ ...formData, allowed_file_types: e.target.value })}
          placeholder="jpg,jpeg,png,pdf,doc,docx"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Automation Settings</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="auto_approve"
            checked={formData.auto_approve_members}
            onChange={(e) => setFormData({ ...formData, auto_approve_members: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
          />
          <label htmlFor="auto_approve" className="text-sm text-gray-700">
            Auto-approve new member applications
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="email_verification"
            checked={formData.require_email_verification}
            onChange={(e) => setFormData({ ...formData, require_email_verification: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
          />
          <label htmlFor="email_verification" className="text-sm text-gray-700">
            Require email verification for new members
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save General Settings'}
        </button>
      </div>
    </form>
  );
};

// Email Settings Component
const EmailSettings = ({ settings, onSave, saving }) => {
  const [formData, setFormData] = useState({
    smtp_host: settings.smtp_host || '',
    smtp_port: settings.smtp_port || '587',
    smtp_user: settings.smtp_user || '',
    smtp_password: settings.smtp_password || '',
    from_email: settings.from_email || '',
    from_name: settings.from_name || 'SAE TKMCE',
    welcome_email_enabled: settings.welcome_email_enabled === 'true',
    notification_email_enabled: settings.notification_email_enabled === 'true'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const settingsToSave = {
      ...formData,
      welcome_email_enabled: formData.welcome_email_enabled.toString(),
      notification_email_enabled: formData.notification_email_enabled.toString()
    };
    onSave(settingsToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMTP Host
          </label>
          <input
            type="text"
            value={formData.smtp_host}
            onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
            placeholder="smtp.gmail.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMTP Port
          </label>
          <input
            type="number"
            value={formData.smtp_port}
            onChange={(e) => setFormData({ ...formData, smtp_port: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMTP Username
          </label>
          <input
            type="text"
            value={formData.smtp_user}
            onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMTP Password
          </label>
          <input
            type="password"
            value={formData.smtp_password}
            onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Email
          </label>
          <input
            type="email"
            value={formData.from_email}
            onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Name
          </label>
          <input
            type="text"
            value={formData.from_name}
            onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Email Notifications</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="welcome_email"
            checked={formData.welcome_email_enabled}
            onChange={(e) => setFormData({ ...formData, welcome_email_enabled: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
          />
          <label htmlFor="welcome_email" className="text-sm text-gray-700">
            Send welcome email to new members
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notification_email"
            checked={formData.notification_email_enabled}
            onChange={(e) => setFormData({ ...formData, notification_email_enabled: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
          />
          <label htmlFor="notification_email" className="text-sm text-gray-700">
            Send admin notifications for new registrations
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Email Settings'}
        </button>
      </div>
    </form>
  );
};

// Integrations Settings Component
const IntegrationsSettings = ({ settings, onSave, saving }) => {
  const [formData, setFormData] = useState({
    imagekit_public_key: settings.imagekit_public_key || '',
    imagekit_private_key: settings.imagekit_private_key || '',
    imagekit_url_endpoint: settings.imagekit_url_endpoint || '',
    google_analytics_id: settings.google_analytics_id || '',
    facebook_pixel_id: settings.facebook_pixel_id || '',
    supabase_url: settings.supabase_url || '',
    supabase_anon_key: settings.supabase_anon_key || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">🖼️ ImageKit Configuration</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Public Key
              </label>
              <input
                type="text"
                value={formData.imagekit_public_key}
                onChange={(e) => setFormData({ ...formData, imagekit_public_key: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Private Key
              </label>
              <input
                type="password"
                value={formData.imagekit_private_key}
                onChange={(e) => setFormData({ ...formData, imagekit_private_key: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Endpoint
              </label>
              <input
                type="url"
                value={formData.imagekit_url_endpoint}
                onChange={(e) => setFormData({ ...formData, imagekit_url_endpoint: e.target.value })}
                placeholder="https://ik.imagekit.io/your_imagekit_id"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">🗄️ Supabase Configuration</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supabase URL
              </label>
              <input
                type="url"
                value={formData.supabase_url}
                onChange={(e) => setFormData({ ...formData, supabase_url: e.target.value })}
                placeholder="https://your-project.supabase.co"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supabase Anon Key
              </label>
              <input
                type="password"
                value={formData.supabase_anon_key}
                onChange={(e) => setFormData({ ...formData, supabase_anon_key: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">📊 Analytics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={formData.google_analytics_id}
                onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                placeholder="GA-XXXXXXXXX-X"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={formData.facebook_pixel_id}
                onChange={(e) => setFormData({ ...formData, facebook_pixel_id: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Integration Settings'}
        </button>
      </div>
    </form>
  );
};

// Admin Users Settings Component
const AdminUsersSettings = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal] = useState(false); // future: invite modal

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const users = await adminService.getAdminUsers();
      setAdminUsers(users);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading admin users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900">Admin Users</h4>
  <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          ➕ Invite Admin
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adminUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-700 mr-3">
                    ✏️
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Backup Settings Component
const BackupSettings = () => {
  const [backupStatus] = useState({
    lastBackup: null,
    backupSize: 0,
    autoBackupEnabled: false
  });

  const handleCreateBackup = async () => {
    alert('Backup functionality would be implemented here');
  };

  const handleRestoreBackup = async () => {
    alert('Restore functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">💾 Data Backup</h4>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-medium text-gray-900">Last Backup</div>
              <div className="text-xs text-gray-500">
                {backupStatus.lastBackup ? new Date(backupStatus.lastBackup).toLocaleDateString() : 'Never'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💾</div>
              <div className="text-sm font-medium text-gray-900">Backup Size</div>
              <div className="text-xs text-gray-500">{(backupStatus.backupSize / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-sm font-medium text-gray-900">Auto Backup</div>
              <div className="text-xs text-gray-500">
                {backupStatus.autoBackupEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleCreateBackup}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          💾 Create Backup
        </button>
        <button
          onClick={handleRestoreBackup}
          className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
        >
          🔄 Restore Backup
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <span className="text-yellow-400 mr-2">⚠️</span>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Important</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Regular backups are essential for data safety. Enable auto-backup for daily automated backups.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
