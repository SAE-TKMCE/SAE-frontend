import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/supabaseMock';

const FormBuilder = () => {
  const [formTemplates, setFormTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [editingField, setEditingField] = useState(null);

  // Available field types
  const fieldTypes = [
    { id: 'text', name: 'Text Input', icon: '📝', description: 'Single line text input' },
    { id: 'textarea', name: 'Text Area', icon: '📄', description: 'Multi-line text input' },
    { id: 'email', name: 'Email', icon: '📧', description: 'Email address input' },
    { id: 'phone', name: 'Phone', icon: '📞', description: 'Phone number input' },
    { id: 'select', name: 'Dropdown', icon: '📋', description: 'Select from options' },
    { id: 'radio', name: 'Radio Buttons', icon: '🔘', description: 'Single choice from options' },
    { id: 'checkbox', name: 'Checkboxes', icon: '☑️', description: 'Multiple choices' },
    { id: 'file', name: 'File Upload', icon: '📎', description: 'File/image upload' },
    { id: 'date', name: 'Date', icon: '📅', description: 'Date picker' },
    { id: 'number', name: 'Number', icon: '🔢', description: 'Numeric input' },
    { id: 'url', name: 'URL', icon: '🔗', description: 'Website URL input' }
  ];

  useEffect(() => {
    fetchFormTemplates();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedTemplate) {
      fetchFormFields(selectedTemplate.id);
    }
  }, [selectedTemplate]);

  const fetchFormTemplates = async () => {
    try {
      setLoading(true);
      const templates = await adminService.getFormTemplates();
      setFormTemplates(templates);
      if (templates.length > 0 && !selectedTemplate) {
        setSelectedTemplate(templates[0]);
      }
    } catch (error) {
      console.error('Error fetching form templates:', error);
      setError('Failed to fetch form templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchFormFields = async (templateId) => {
    try {
      const fields = await adminService.getFormFields(templateId);
      setFormFields(fields.sort((a, b) => a.order_index - b.order_index));
    } catch (error) {
      console.error('Error fetching form fields:', error);
      setError('Failed to fetch form fields');
    }
  };

  const handleCreateTemplate = async () => {
    const name = prompt('Enter form template name:');
    if (!name) return;

    const type = prompt('Enter form type (membership/event):');
    if (!type || !['membership', 'event'].includes(type)) {
      alert('Form type must be either "membership" or "event"');
      return;
    }

    try {
      const newTemplate = await adminService.createFormTemplate({
        name,
        type,
        description: `${type} registration form`,
        is_active: true
      });
      
      setFormTemplates(prev => [...prev, newTemplate]);
      setSelectedTemplate(newTemplate);
      alert('Form template created successfully!');
    } catch (error) {
      console.error('Error creating form template:', error);
      alert('Failed to create form template');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      await adminService.deleteFormTemplate(templateId);
      setFormTemplates(prev => prev.filter(t => t.id !== templateId));
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(formTemplates.find(t => t.id !== templateId) || null);
      }
      alert('Form template deleted successfully!');
    } catch (error) {
      console.error('Error deleting form template:', error);
      alert('Failed to delete form template');
    }
  };

  const handleAddField = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      field_type: fieldType.id,
      label: `New ${fieldType.name}`,
      placeholder: '',
      required: false,
      options: fieldType.id === 'select' || fieldType.id === 'radio' || fieldType.id === 'checkbox' ? ['Option 1', 'Option 2'] : null,
      validation_rules: {},
      order_index: formFields.length,
      is_active: true
    };
    
    setEditingField(newField);
    setShowFieldEditor(true);
  };

  const handleEditField = (field) => {
    setEditingField({ ...field });
    setShowFieldEditor(true);
  };

  const handleSaveField = async (fieldData) => {
    try {
      setSaving(true);
      
      const fieldToSave = {
        ...fieldData,
        form_template_id: selectedTemplate.id
      };

      if (fieldData.id && fieldData.id.toString().startsWith('field_')) {
        // New field
        const newField = await adminService.createFormField(fieldToSave);
        setFormFields(prev => [...prev, newField].sort((a, b) => a.order_index - b.order_index));
      } else {
        // Update existing field
        await adminService.updateFormField(fieldData.id, fieldToSave);
        setFormFields(prev => 
          prev.map(field => 
            field.id === fieldData.id ? { ...field, ...fieldToSave } : field
          ).sort((a, b) => a.order_index - b.order_index)
        );
      }
      
      setShowFieldEditor(false);
      setEditingField(null);
      alert('Field saved successfully!');
    } catch (error) {
      console.error('Error saving field:', error);
      alert('Failed to save field');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Are you sure you want to delete this field?')) {
      return;
    }

    try {
      await adminService.deleteFormField(fieldId);
      setFormFields(prev => prev.filter(field => field.id !== fieldId));
      alert('Field deleted successfully!');
    } catch (error) {
      console.error('Error deleting field:', error);
      alert('Failed to delete field');
    }
  };

  const moveField = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= formFields.length) return;
    
    const newFields = [...formFields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    
    // Update order_index for all fields
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order_index: index
    }));
    
    setFormFields(updatedFields);
  };

  const getFieldIcon = (fieldType) => {
    const type = fieldTypes.find(t => t.id === fieldType);
    return type ? type.icon : '❓';
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
          <p className="text-gray-600">Create and customize registration forms</p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          ➕ New Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Form Templates</h3>
            <div className="space-y-2">
              {formTemplates.map(template => (
                <div
                  key={template.id}
                  className={`p-3 rounded-md cursor-pointer border ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm opacity-75">{template.type}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Builder */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedTemplate.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Use up/down buttons to reorder fields
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {formFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border border-gray-200 rounded-md p-4 shadow-sm bg-white"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">
                            {getFieldIcon(field.field_type)}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {field.field_type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveField(index, index - 1)}
                            disabled={index === 0}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded"
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveField(index, index + 1)}
                            disabled={index === formFields.length - 1}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded"
                            title="Move Down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleEditField(field)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteField(field.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {formFields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No fields added yet. Add some fields from the panel on the right.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Template Selected</h3>
              <p className="text-gray-600">Select a template from the left panel to start building forms.</p>
            </div>
          )}
        </div>

        {/* Field Types Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Fields</h3>
            <div className="space-y-2">
              {fieldTypes.map(fieldType => (
                <button
                  key={fieldType.id}
                  onClick={() => handleAddField(fieldType)}
                  disabled={!selectedTemplate}
                  className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{fieldType.icon}</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {fieldType.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {fieldType.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Field Editor Modal */}
      {showFieldEditor && editingField && (
        <FieldEditor
          field={editingField}
          fieldTypes={fieldTypes}
          onSave={handleSaveField}
          onCancel={() => {
            setShowFieldEditor(false);
            setEditingField(null);
          }}
          saving={saving}
        />
      )}
    </div>
  );
};

// Field Editor Component
const FieldEditor = ({ field, fieldTypes, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState(field);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(formData.options || []), `Option ${(formData.options?.length || 0) + 1}`];
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = formData.options?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, options: newOptions });
  };

  const fieldType = fieldTypes.find(t => t.id === formData.field_type);
  const needsOptions = ['select', 'radio', 'checkbox'].includes(formData.field_type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {fieldType?.icon} Edit {fieldType?.name}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={formData.placeholder || ''}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Required Field</span>
            </label>
          </div>

          {needsOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options
              </label>
              <div className="space-y-2">
                {formData.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ➕ Add Option
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormBuilder;
