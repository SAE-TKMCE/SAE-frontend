import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Badge,
} from '@chakra-ui/react';
import { designTemplatesApi } from '../../features/design-templates/api';
import TemplateEditor from '../../features/design-templates/TemplateEditor';

const DesignTemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadTemplates = useCallback(async () => {
    try {
      const data = await designTemplatesApi.getAll();
      setTemplates(data);
    } catch (error) {
      showNotification('Failed to load templates', 'error');
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSave = async (data) => {
    try {
      if (editingTemplate) {
        await designTemplatesApi.update(editingTemplate.id, data);
        showNotification('Template updated successfully');
      } else {
        await designTemplatesApi.create(data);
        showNotification('Template created successfully');
      }
      setShowEditor(false);
      setEditingTemplate(null);
      loadTemplates();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to save template', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await designTemplatesApi.delete(id);
        showNotification('Template deleted successfully');
        loadTemplates();
      } catch (error) {
        showNotification('Failed to delete template', 'error');
      }
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleDuplicate = async (id) => {
    try {
      await designTemplatesApi.duplicate(id);
      showNotification('Template duplicated successfully');
      loadTemplates();
    } catch (error) {
      showNotification('Failed to duplicate template', 'error');
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
      
      {showEditor ? (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingTemplate(null);
          }}
        />
      ) : (
        <Box>
          <Heading mb={6}>Design Template Management</Heading>
          <Button
            colorScheme="blue"
            onClick={() => {
              setEditingTemplate(null);
              setShowEditor(true);
            }}
            mb={4}
          >
            Create New Template
          </Button>
          
          <Table.Root variant="outline" className="w-full">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Created</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {templates.map((template) => (
                <Table.Row key={template.id}>
                  <Table.Cell>{template.name}</Table.Cell>
                  <Table.Cell>{template.category}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={template.is_active ? 'green' : 'gray'}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{new Date(template.created_at).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEdit(template)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleDuplicate(template.id)}
                      >
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(template.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Container>
  );
};

export default DesignTemplateManagement;