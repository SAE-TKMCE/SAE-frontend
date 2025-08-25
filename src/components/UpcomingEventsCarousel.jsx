import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";

export default function UpcomingEventsCarousel({ events }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    centerMode: true,
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[min(100vw,400px)] aspect-[9/16] max-w-xs relative">
        <Slider {...settings}>
          {events.map((event) => (
            <div key={event.id} style={{ width: 350 }}>
              <a
                href={`/events/${event.id}`}
                className="block group"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    padding: "16px 22px",
                    boxSizing: "border-box",
                  }}
                  className="relative h-[400px] flex items-center justify-center  rounded-2xl  overflow-hidden"
                >
                  {/* Poster/Photo only */}
                  <div className="w-full h-full flex items-center justify-center">
                    {event.image_url || event.image ? (
                      <img
                        src={event.image_url || event.image}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎉</div>
                          <p className="text-sm opacity-80">Event Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Arrow button overlay at bottom right */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="bg-blue-600 rounded-full p-2 shadow-lg group-hover:bg-blue-700 transition">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
