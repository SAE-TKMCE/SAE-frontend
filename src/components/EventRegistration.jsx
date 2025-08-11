import React from 'react';

const EventRegistration = ({ events, onRegisterEvent }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No events available for registration</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="mr-1">📅</span>
                  {event.date}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🕐</span>
                  {event.time}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">📍</span>
                  {event.location}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ₹{event.price}
              </div>
              {event.capacity && (
                <div className="text-sm text-gray-500">
                  {event.registered || 0}/{event.capacity} registered
                </div>
              )}
            </div>
          </div>
          
          {event.requirements && event.requirements.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
              <ul className="space-y-1">
                {event.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Registration deadline: {event.deadline}
            </div>
            <button
              onClick={() => onRegisterEvent && onRegisterEvent(event)}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              disabled={event.capacity && event.registered >= event.capacity}
            >
              {event.capacity && event.registered >= event.capacity ? 'Full' : 'Register'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventRegistration;
