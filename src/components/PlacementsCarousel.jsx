import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from "react";

export default function PlacementsCarousel({ placements, onPlacementClick }) {
  const [imageLoading, setImageLoading] = useState(Array(placements.length).fill(true));

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
      // Remove scale from current
      const currentSlide = document.querySelector('.slick-current .slick-slide-content');
      if (currentSlide) {
        currentSlide.style.transform = 'scale(1)';
      }
    },
    afterChange: (current) => {
      // Add scale to new current
      const currentSlide = document.querySelector('.slick-current .slick-slide-content');
      if (currentSlide) {
        currentSlide.style.transform = 'scale(1.1)';
      }
    }
  };

  // Add custom styles to head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
            <div key={`${placement.company}-${idx}`} style={{ width: 400 }}>
              <div 
                style={{ padding: "16px 32px", boxSizing: "border-box" }}
                className="cursor-pointer"
                onClick={() => onPlacementClick(placement)}
              >
                <div className="relative" style={{ aspectRatio: "2/3" }}>
                  {imageLoading[idx] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl z-10">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div 
                    className="relative rounded-xl shadow-lg overflow-hidden bg-gray-800 h-full transform hover:scale-105 transition-all duration-300 slick-slide-content"
                  >
                    <img
                      src={placement.image}
                      alt={placement.student}
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        setImageLoading(prev => {
                          const updated = [...prev];
                          updated[idx] = false;
                          return updated;
                        });
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{placement.student}</h3>
                      <p className="text-sm text-gray-300">{placement.company}</p>
                      <p className="text-xs text-gray-400">{placement.year}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-blue-600/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      Placed
                    </div>
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