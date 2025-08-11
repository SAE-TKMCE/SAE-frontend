import React, { useState, useEffect } from 'react';
import { airtableService } from '../services/airtable';

const AirtableTest = () => {
  const [forms, setForms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        console.log('Fetching Airtable forms...');
        const airtableForms = await airtableService.getAirtableForms();
        console.log('Airtable forms received:', airtableForms);
        setForms(airtableForms);
      } catch (err) {
        console.error('Error fetching Airtable forms:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const testForm = (formType, formData) => {
    console.log(`Testing ${formType} form:`, formData);
    if (formData?.url) {
      airtableService.openAirtableForm(formData.url, formData.name);
    } else {
      alert(`No URL configured for ${formType} form`);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Airtable Forms Test</h1>
        <p>Loading forms...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Airtable Forms Test Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
        <strong>Debug Info:</strong>
        <ul className="mt-2 list-disc list-inside">
          <li>Forms loaded: {Object.keys(forms).length}</li>
          <li>Available form types: {Object.keys(forms).join(', ') || 'None'}</li>
        </ul>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Available Forms:</h2>
        
        {Object.keys(forms).length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p><strong>No active forms found!</strong></p>
            <p className="text-sm mt-1">
              This means either:
              <br />• No forms are configured in the admin panel
              <br />• All forms are set to inactive
              <br />• There's an API connection issue
            </p>
          </div>
        ) : (
          Object.entries(forms).map(([formType, formData]) => (
            <div key={formType} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{formData.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{formData.description}</p>
                  <p className="text-xs text-gray-500">Type: {formType}</p>
                  <p className="text-xs text-gray-500">URL: {formData.url ? 'Configured ✓' : 'Not configured ✗'}</p>
                </div>
                <button
                  onClick={() => testForm(formType, formData)}
                  className={`px-4 py-2 rounded font-medium ${
                    formData.url 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!formData.url}
                >
                  Test Form
                </button>
              </div>
            </div>
          ))
        )}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Set Up:</h3>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Go to Django Admin Panel</li>
            <li>Navigate to "SAE Configuration" → "Airtable Form Configurations"</li>
            <li>Update the placeholder URLs with real Airtable form URLs</li>
            <li>Set "Is Active" to True for each form</li>
            <li>Save and refresh this page</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AirtableTest;
