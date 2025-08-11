/**
 * ImageKit Service
 * Handles image uploads and management with ImageKit.io
 */

import ImageKit from 'imagekit-javascript';

// ImageKit configuration
const IMAGEKIT_URL_ENDPOINT = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT || 'YOUR_IMAGEKIT_URL_ENDPOINT';
const IMAGEKIT_PUBLIC_KEY = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY || 'YOUR_IMAGEKIT_PUBLIC_KEY';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT
});

class ImageKitService {
  constructor() {
    // REACT_APP_API_URL usually ends with '/api'
    const base = process.env.REACT_APP_API_URL || '';
    this.authenticationEndpoint = base ? `${base}/imagekit-auth` : '/imagekit-auth';
  }

  /**
   * Upload image to ImageKit
   * @param {File} file - The image file to upload
   * @param {string} folder - Folder to upload to (e.g., 'events', 'members', 'gallery')
   * @param {Object} options - Additional upload options
   */
  async uploadImage(file, folder = 'general', options = {}) {
    try {
      const fileName = options.fileName || `${Date.now()}_${file.name}`;
      const tags = options.tags || [folder];
      
      const uploadOptions = {
        file: file,
        fileName: fileName,
        folder: `sae-tkmce/${folder}`,
        tags: tags.join(','),
        useUniqueFileName: true,
        ...options
      };

      // Get authentication parameters from backend
      const authResponse = await fetch(this.authenticationEndpoint);
      const authData = await authResponse.json();

      // Upload to ImageKit
      const result = await imagekit.upload({
        ...uploadOptions,
        signature: authData.signature,
        expire: authData.expire,
        token: authData.token
      });

      return {
        success: true,
        data: {
          fileId: result.fileId,
          name: result.name,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          filePath: result.filePath,
          size: result.size,
          fileType: result.fileType,
          tags: result.tags,
          folder: folder,
          width: result.width,
          height: result.height
        }
      };
    } catch (error) {
      console.error('ImageKit upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image'
      };
    }
  }

  /**
   * Delete image from ImageKit
   * @param {string} fileId - ImageKit file ID
   */
  async deleteImage(fileId) {
    try {
      // This requires server-side implementation as delete needs private key
  const base = process.env.REACT_APP_API_URL || '';
  const response = await fetch(`${base ? `${base}` : ''}/imagekit-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      return { success: true };
    } catch (error) {
      console.error('ImageKit delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete image'
      };
    }
  }

  /**
   * Generate optimized image URL
   * @param {string} path - Image path or URL
   * @param {Object} transformations - ImageKit transformations
   */
  getOptimizedUrl(path, transformations = {}) {
    const defaultTransformations = {
      quality: 80,
      format: 'auto'
    };

    const finalTransformations = { ...defaultTransformations, ...transformations };

    const isAbsolute = /^https?:\/\//i.test(path);
    const transformationsArray = Object.entries(finalTransformations).map(([key, value]) => ({ [key]: value }));

    // If it's an absolute URL not served by ImageKit, return as-is (can't transform)
    if (isAbsolute && IMAGEKIT_URL_ENDPOINT && !path.startsWith(IMAGEKIT_URL_ENDPOINT)) {
      return path;
    }

    // If absolute URL and from ImageKit, use 'src'. Else use 'path'.
    const urlOptions = isAbsolute
      ? { src: path, transformation: transformationsArray }
      : { path: path, transformation: transformationsArray };

    return imagekit.url(urlOptions);
  }

  /**
   * Upload multiple images
   * @param {FileList} files - Multiple image files
   * @param {string} folder - Folder to upload to
   * @param {Function} onProgress - Progress callback
   */
  async uploadMultiple(files, folder = 'general', onProgress = () => {}) {
    const results = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await this.uploadImage(file, folder);
      results.push(result);
      
      onProgress({
        completed: i + 1,
        total: total,
        percentage: Math.round(((i + 1) / total) * 100),
        currentFile: file.name,
        result: result
      });
    }

    return results;
  }

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @param {Object} constraints - Validation constraints
   */
  validateImage(file, constraints = {}) {
    const defaultConstraints = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      maxWidth: 4000,
      maxHeight: 4000
    };

    const finalConstraints = { ...defaultConstraints, ...constraints };
    const errors = [];

    // Check file type
    if (!finalConstraints.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed. Allowed types: ${finalConstraints.allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > finalConstraints.maxSize) {
      errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(finalConstraints.maxSize / 1024 / 1024)}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Generate thumbnail URL
   * @param {string} imagePath - Original image path
   * @param {Object} options - Thumbnail options
   */
  getThumbnail(imagePath, options = {}) {
    const defaultOptions = {
      width: 200,
      height: 200,
      crop: 'at_max',
      quality: 80
    };

    const thumbnailOptions = { ...defaultOptions, ...options };
    
    return this.getOptimizedUrl(imagePath, thumbnailOptions);
  }

  /**
   * Get image details from ImageKit
   * @param {string} fileId - ImageKit file ID
   */
  async getImageDetails(fileId) {
    try {
  const base = process.env.REACT_APP_API_URL || '';
  const response = await fetch(`${base ? `${base}` : ''}/imagekit-details/${fileId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get image details');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('ImageKit details error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get image details'
      };
    }
  }
}

// Export singleton instance
const imagekitService = new ImageKitService();
export default imagekitService;

// Helper functions for common image operations
export const imageHelpers = {
  /**
   * Create responsive image srcSet
   * @param {string} imagePath - Base image path
   * @param {Array} sizes - Array of sizes for responsive images
   */
  createResponsiveSrcSet(imagePath, sizes = [320, 640, 1024, 1440]) {
    return sizes
      .map(size => {
        const url = imagekitService.getOptimizedUrl(imagePath, { width: size });
        return `${url} ${size}w`;
      })
      .join(', ');
  },

  /**
   * Get event image with fallback
   * @param {Object} event - Event object
   * @param {string} size - Image size (small, medium, large)
   */
  getEventImage(event, size = 'medium') {
    const sizeMap = {
      small: { width: 300, height: 200 },
      medium: { width: 600, height: 400 },
      large: { width: 1200, height: 800 }
    };

    if (event.image_url) {
      return imagekitService.getOptimizedUrl(event.image_url, {
        ...sizeMap[size],
        crop: 'maintain_ratio'
      });
    }

    // Return placeholder image if no image is set
    return `/images/placeholders/event-${size}.jpg`;
  },

  /**
   * Get member avatar with fallback
   * @param {Object} member - Member object
   * @param {string} size - Avatar size
   */
  getMemberAvatar(member, size = 'medium') {
    const sizeMap = {
      small: { width: 64, height: 64 },
      medium: { width: 128, height: 128 },
      large: { width: 256, height: 256 }
    };

    if (member.avatar_url) {
      return imagekitService.getOptimizedUrl(member.avatar_url, {
        ...sizeMap[size],
        crop: 'maintain_ratio',
        focus: 'face'
      });
    }

    // Return default avatar
    return `/images/placeholders/avatar-${size}.jpg`;
  }
};
