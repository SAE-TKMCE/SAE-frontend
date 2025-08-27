import React from 'react';
import Navbar from './layout/Navbar';

const VideoLoader = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    zIndex: 9999, background: '#d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <Navbar />
    <div className="text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            </div>
    <video
      src="/Coming_soon_bg.mp4"
      autoPlay
      loop
      muted
      style={{ width: '50%', height: '50%', objectFit: 'contain' }}
    />
    
  </div>
);

export default VideoLoader;
