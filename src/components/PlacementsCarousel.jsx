import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";

export default function PlacementsCarousel({ placements }) {
  const [imageLoading, setImageLoading] = useState(Array(placements.length).fill(true));
  const [maxDimensions, setMaxDimensions] = useState({ width: 0, height: 0 });

  // Calculate image dimensions on load
  const handleImageLoad = (idx, img) => {
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    setImageLoading(prev => {
      const updated = [...prev];
      updated[idx] = false;
      return updated;
    });

    // Track max dimensions
    setMaxDimensions(prev => ({
      width: Math.max(prev.width, naturalWidth),
      height: Math.max(prev.height, naturalHeight)
    }));
  };

  // Calculate aspect ratio from max dimensions
  const aspectRatio = maxDimensions.width && maxDimensions.height 
    ? maxDimensions.width / maxDimensions.height 
    : 2 / 3;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    centerMode: true,
    centerPadding: '60px',
    variableWidth: false,
    arrows: false,
    beforeChange: (current, next) => {
      const currentSlide = document.querySelector('.slick-current .slick-slide-content');
      if (currentSlide) {
        currentSlide.style.transform = 'scale(1)';
      }
    },
    afterChange: (current) => {
      const currentSlide = document.querySelector('.slick-current .slick-slide-content');
      if (currentSlide) {
        currentSlide.style.transform = 'scale(1.1)';
      }
    }
  };

  // Add custom styles to head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .placement-image-container {
        border-radius: 24px;
        overflow: hidden;
      }
      .placement-image-container img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
        borderRadius: 24px;
      }
      .slick-center .slick-slide-content {
        transform: scale(1.1);
        transition: transform 0.5s ease;
        
      }
      .slick-slide:not(.slick-center) .slick-slide-content {
        transform: scale(0.9);
        transition: transform 0.5s ease;
        
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[min(100vw,600px)] relative">
        <Slider {...settings}>
          {placements.map((placement, idx) => (
            <div key={`${placement.company}-${idx}`} style={{ width: '100%', padding: '0 16px', boxSizing: 'border-box' }}>
              <div>
                {/* Dynamic container based on image aspect ratio */}
                <div 
                  className="relative"
                  style={{ 
                    aspectRatio: `${aspectRatio}`,
                    minHeight: '400px',
                    maxWidth: '100%'
                  }}
                >
                  {imageLoading[idx] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-3xl z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div 
                    className="placement-image-container relative shadow-lg h-full w-full slick-slide-content"
                  >
                    <img 
                      src={placement.image}
                      alt={placement.student}
                      onLoad={(e) => handleImageLoad(idx, e.currentTarget)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}