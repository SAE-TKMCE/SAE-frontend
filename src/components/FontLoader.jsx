import { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    const adobeFontsToken = process.env.REACT_APP_ADOBE_FONTS_TOKEN;
    
    if (adobeFontsToken && adobeFontsToken !== 'YOUR_API_TOKEN') {
      // Create and append the Adobe Fonts CSS link
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://use.typekit.net/${adobeFontsToken}.css`;
      document.head.appendChild(link);

      // Cleanup function to remove the link when component unmounts
      return () => {
        const existingLink = document.querySelector(`link[href*="${adobeFontsToken}"]`);
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
      };
    } else {
      console.warn('Adobe Fonts token not found or not set. Please add REACT_APP_ADOBE_FONTS_TOKEN to your .env file');
    }
  }, []);

  return null; // This component doesn't render anything
};

export default FontLoader;
