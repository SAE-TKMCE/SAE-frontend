
import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      <h1 className="text-5xl font-extrabold mb-8 text-center tracking-tight z-10 text-white">Login Coming Soon!</h1>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-bottom z-0"
        style={{ minHeight: '100vh', minWidth: '100vw' }}
      >
        <source src="/Coming_soon_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Overlay to darken video for text readability */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
    </div>
  );
};

export default Login;
