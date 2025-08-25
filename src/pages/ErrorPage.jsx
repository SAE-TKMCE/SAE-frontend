import React from 'react';

const ErrorPage = ({ code = 404, message = 'Page Not Found', details }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg">
        <h1 className="text-6xl font-black text-blue-900 mb-4">{code}</h1>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{message}</h2>
        {details && <p className="text-gray-600 mb-4">{details}</p>}
        <a href="/" className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Go Home</a>
      </div>
    </div>
  );
};

export default ErrorPage;
