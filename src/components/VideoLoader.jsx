import React from 'react';

const VideoLoader = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    zIndex: 9999, background: '#d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <video
      src="/Coming_soon_bg.mp4"
      autoPlay
      loop
      muted
      style={{ width: '100%', height: '100%', objectFit: 'contain ' }}
    />
  </div>
);

export default VideoLoader;
