import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/supabaseMock';
import imagekitService, { imageHelpers } from '../../services/imagekit';

const MediaManager = () => {
  const [mediaAssets, setMediaAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  const fetchMediaAssets = async () => {
    try {
      setLoading(true);
      const assets = await adminService.getMediaAssets();
      setMediaAssets(assets);
    } catch (error) {
      console.error('Error fetching media assets:', error);
      setError('Failed to fetch media assets');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files, category = 'general') => {
    try {
      setUploading(true);
      
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file
        const validation = imagekitService.validateImage(file);
        if (!validation.isValid) {
          throw new Error(`${file.name}: ${validation.errors.join(', ')}`);
        }

        // Upload to ImageKit
        const uploadResult = await imagekitService.uploadImage(file, {
          folder: `/sae-media/${category}`,
          useUniqueFileName: true,
          tags: [category, 'admin-upload']
        });

        // Save to database
        const mediaAsset = await adminService.createMediaAsset({
          title: file.name.split('.')[0],
          file_name: uploadResult.name,
          file_type: file.type,
          file_size: file.size,
          imagekit_file_id: uploadResult.fileId,
          imagekit_url: uploadResult.url,
          thumbnail_url: uploadResult.thumbnailUrl,
          category,
          metadata: {
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.fileType
          }
        });

        return mediaAsset;
      });

      const newAssets = await Promise.all(uploadPromises);
      setMediaAssets(prev => [...newAssets, ...prev]);
      setShowUploadModal(false);
      alert(`${newAssets.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) {
      return;
    }

    try {
      const asset = mediaAssets.find(a => a.id === assetId);
      if (asset) {
        // Delete from ImageKit
        await imagekitService.deleteFile(asset.imagekit_file_id);
        
        // Delete from database
        await adminService.deleteMediaAsset(assetId);
        
        // Update local state
        setMediaAssets(prev => prev.filter(a => a.id !== assetId));
        setSelectedAssets(prev => prev.filter(id => id !== assetId));
        
        alert('Media asset deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting media asset:', error);
      alert('Failed to delete media asset');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAssets.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedAssets.length} selected assets?`)) {
      return;
    }

    try {
      setLoading(true);
      const deletePromises = selectedAssets.map(async (assetId) => {
        const asset = mediaAssets.find(a => a.id === assetId);
        if (asset) {
          await imagekitService.deleteFile(asset.imagekit_file_id);
          await adminService.deleteMediaAsset(assetId);
        }
      });

      await Promise.all(deletePromises);
      
      setMediaAssets(prev => prev.filter(a => !selectedAssets.includes(a.id)));
      setSelectedAssets([]);
      alert(`${selectedAssets.length} assets deleted successfully!`);
    } catch (error) {
      console.error('Error bulk deleting assets:', error);
      alert('Failed to delete some assets');
    } finally {
      setLoading(false);
    }
  };

  // Note: update handler will be added when inline edit UI is introduced

  const toggleAssetSelection = (assetId) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const getFilteredAssets = () => {
    let filtered = mediaAssets;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(asset => asset.category === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    return '📎';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  const filteredAssets = getFilteredAssets();

  if (loading && mediaAssets.length === 0) {
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
              onClick={fetchMediaAssets}
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Manager</h1>
          <p className="text-gray-600">Upload and manage images, videos, and documents</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            ⬆️ Upload Media
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['general', 'events', 'members', 'banners'].map(category => {
          const count = mediaAssets.filter(asset => asset.category === category).length;
          const totalSize = mediaAssets
            .filter(asset => asset.category === category)
            .reduce((sum, asset) => sum + (asset.file_size || 0), 0);
          
          return (
            <div key={category} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-blue-100 text-blue-800">
                  <span className="text-lg">📁</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 capitalize">{category}</p>
                  <p className="text-2xl font-semibold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(totalSize)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="events">Events</option>
              <option value="members">Members</option>
              <option value="banners">Banners</option>
            </select>
            <div className="flex rounded-md overflow-hidden border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm border-l border-gray-300 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                ≡
              </button>
            </div>
          </div>
        </div>

        {selectedAssets.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedAssets.length} asset(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  🗑️ Delete Selected
                </button>
                <button
                  onClick={() => setSelectedAssets([])}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="group relative bg-gray-50 rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset.id)}
                    onChange={() => toggleAssetSelection(asset.id)}
                    className="absolute top-2 left-2 z-10 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  {asset.file_type.startsWith('image/') ? (
                    <img
                      src={imageHelpers.getOptimizedUrl(asset.imagekit_url, { width: 200, height: 200 })}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-4xl">{getFileTypeIcon(asset.file_type)}</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(asset.imagekit_url)}
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        title="Copy URL"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{asset.title}</h4>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(asset.file_size)} • {asset.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                      onChange={() => {
                        if (selectedAssets.length === filteredAssets.length) {
                          setSelectedAssets([]);
                        } else {
                          setSelectedAssets(filteredAssets.map(asset => asset.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => toggleAssetSelection(asset.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {asset.file_type.startsWith('image/') ? (
                            <img
                              src={imageHelpers.getOptimizedUrl(asset.imagekit_url, { width: 40, height: 40 })}
                              alt=""
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                              <span>{getFileTypeIcon(asset.file_type)}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{asset.title}</div>
                          <div className="text-sm text-gray-500">{asset.file_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(asset.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(asset.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => copyToClipboard(asset.imagekit_url)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Copy URL"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Upload some media files to get started.'}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ⬆️ Upload Media
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onUpload={handleFileUpload}
          onClose={() => setShowUploadModal(false)}
          uploading={uploading}
        />
      )}
    </div>
  );
};

// Upload Modal Component
const UploadModal = ({ onUpload, onClose, uploading }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('general');
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles, category);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Media Files</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="events">Events</option>
              <option value="members">Members</option>
              <option value="banners">Banners</option>
            </select>
          </div>

          <div
            className={`border-2 border-dashed rounded-md p-6 text-center ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-2">⬆️</div>
              <p className="text-gray-600">
                Drop files here or click to select
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Images, videos, PDFs, documents
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || selectedFiles.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaManager;
