import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Convert pathname to breadcrumb items
  const getPathItems = () => {
    const paths = location.pathname.split('/').filter(item => item);
    
    // Create items array with paths and labels
    return paths.map((path, index) => {
      // Create the full path up to this point
      const fullPath = '/' + paths.slice(0, index + 1).join('/');
      
      // Convert path to display label (capitalize and replace hyphens)
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        path: fullPath,
        label,
        isLast: index === paths.length - 1
      };
    });
  };

  const pathItems = getPathItems();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
        </li>

        {/* Path items */}
        {pathItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {/* Separator */}
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>

            {/* Link or text for current item */}
            {item.isLast ? (
              <span className="ml-2 text-gray-800 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;