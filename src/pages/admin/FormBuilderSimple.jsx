import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/supabaseMock';

const FormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldData, setFieldData] = useState({
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: ''
  });

  // CSS Animation Styles
  const styles = `
    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(25px, 25px); }
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .slide-in { animation: slideIn 0.3s ease-out; }
    .fade-in { animation: fadeIn 0.5s ease-out; }
  `;

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
    { id: 'number', name: 'Number', icon: '🔢', description: 'Numeric input' }
  ];

  useEffect(() => {
    fetchFormFields();
  }, []);

  const fetchFormFields = async () => {
    try {
      setLoading(true);
      const fields = await adminService.getFormFields();
      setFormFields(fields || []);
    } catch (error) {
      console.error('Error fetching form fields:', error);
      setError('Failed to load form fields');
    } finally {
      setLoading(false);
    }
  };

  const getFieldIcon = (type) => {
    const fieldType = fieldTypes.find(ft => ft.id === type);
    return fieldType ? fieldType.icon : '📝';
  };

  const handleAddField = () => {
    setEditingField(null);
    setFieldData({
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: ''
    });
    setShowFieldEditor(true);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setFieldData({
      label: field.label || '',
      type: field.type || 'text',
      required: field.required || false,
      placeholder: field.placeholder || '',
      options: field.options ? field.options.join('\n') : ''
    });
    setShowFieldEditor(true);
  };

  const handleSaveField = async () => {
    try {
      const fieldToSave = {
        ...fieldData,
        options: fieldData.options ? fieldData.options.split('\n').filter(opt => opt.trim()) : [],
        order_index: editingField ? editingField.order_index : formFields.length
      };

      if (editingField) {
        await adminService.updateFormField(editingField.id, fieldToSave);
        setFormFields(formFields.map(field => 
          field.id === editingField.id ? { ...field, ...fieldToSave } : field
        ));
      } else {
        const newField = await adminService.createFormField(fieldToSave);
        setFormFields([...formFields, newField]);
      }

      setShowFieldEditor(false);
      setEditingField(null);
      setFieldData({ label: '', type: 'text', required: false, placeholder: '', options: '' });
    } catch (error) {
      console.error('Error saving field:', error);
      setError('Failed to save field');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        await adminService.deleteFormField(fieldId);
        setFormFields(formFields.filter(field => field.id !== fieldId));
      } catch (error) {
        console.error('Error deleting field:', error);
        setError('Failed to delete field');
      }
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

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'gridMove 20s ease-in-out infinite alternate'
              }}
            ></div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse">
              <span className="text-2xl">📝</span>
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mb-4"></div>
            <p className="text-gray-300 font-medium">Loading Form Builder...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s ease-in-out infinite alternate'
            }}
          ></div>
        </div>

        <div className="relative z-10 p-6 space-y-6">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold text-white">📝</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'Almarai, sans-serif'}}>
              Form Builder
            </h1>
            <p className="text-gray-400 text-lg">Create and manage dynamic forms for SAE TKMCE</p>
          </div>

          {error && (
            <div className="bg-red-900/50 backdrop-blur-xl border border-red-500/50 rounded-xl p-6 max-w-lg mx-auto slide-in">
              <div className="flex items-center mb-4">
                <span className="text-red-400 mr-3 text-2xl">⚠️</span>
                <div>
                  <h3 className="text-lg font-medium text-red-300">Error</h3>
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Fields List */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 slide-in">
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">Form Fields</h2>
                      <p className="text-gray-400 text-sm">Manage your form structure</p>
                    </div>
                    <button
                      onClick={handleAddField}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      + Add Field
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {formFields.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-6xl mb-4 block">📝</span>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">No fields added yet</h3>
                      <p className="text-gray-400 mb-4">Create your first form field to get started</p>
                      <button
                        onClick={handleAddField}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Add Your First Field
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4 hover:border-gray-500/50 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-300 text-lg">
                                {getFieldIcon(field.type)}
                              </span>
                              <div>
                                <h4 className="text-white font-medium">{field.label}</h4>
                                <p className="text-gray-400 text-sm capitalize">{field.type}</p>
                                {field.required && (
                                  <span className="inline-block mt-1 px-2 py-1 bg-red-600/20 text-red-300 text-xs rounded">
                                    Required
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* Move Up Button */}
                              <button
                                onClick={() => moveField(index, index - 1)}
                                disabled={index === 0}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors duration-200"
                                title="Move Up"
                              >
                                ↑
                              </button>
                              {/* Move Down Button */}
                              <button
                                onClick={() => moveField(index, index + 1)}
                                disabled={index === formFields.length - 1}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors duration-200"
                                title="Move Down"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => handleEditField(field)}
                                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors duration-200"
                                title="Edit Field"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteField(field.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-200"
                                title="Delete Field"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Field Types Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 slide-in">
                <div className="p-6 border-b border-gray-700/50">
                  <h3 className="text-lg font-bold text-white">Available Field Types</h3>
                  <p className="text-gray-400 text-sm">Click to add to your form</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-3">
                    {fieldTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setFieldData({ ...fieldData, type: type.id });
                          handleAddField();
                        }}
                        className="text-left p-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 rounded-lg transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{type.icon}</span>
                          <div>
                            <h4 className="text-white font-medium group-hover:text-blue-300 transition-colors">
                              {type.name}
                            </h4>
                            <p className="text-gray-400 text-xs">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Field Editor Modal */}
          {showFieldEditor && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-xl font-bold text-white">
                    {editingField ? 'Edit Field' : 'Add New Field'}
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Field Label</label>
                    <input
                      type="text"
                      value={fieldData.label}
                      onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter field label"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Field Type</label>
                    <select
                      value={fieldData.type}
                      onChange={(e) => setFieldData({ ...fieldData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Placeholder</label>
                    <input
                      type="text"
                      value={fieldData.placeholder}
                      onChange={(e) => setFieldData({ ...fieldData, placeholder: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter placeholder text"
                    />
                  </div>

                  {(fieldData.type === 'select' || fieldData.type === 'radio' || fieldData.type === 'checkbox') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Options (one per line)</label>
                      <textarea
                        value={fieldData.options}
                        onChange={(e) => setFieldData({ ...fieldData, options: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="required"
                      checked={fieldData.required}
                      onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
                      className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="required" className="ml-2 text-sm text-gray-300">
                      Required field
                    </label>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowFieldEditor(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveField}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    {editingField ? 'Update Field' : 'Add Field'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormBuilder;
