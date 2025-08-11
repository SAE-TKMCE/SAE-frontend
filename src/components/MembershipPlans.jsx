import React from 'react';

const MembershipPlans = ({ membershipTypes, onSelectPlan }) => {
  if (!membershipTypes || membershipTypes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No membership plans available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {membershipTypes.map((plan) => (
        <div
          key={plan.id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ₹{plan.price}
              <span className="text-lg text-gray-500 font-normal">/{plan.duration}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
            
            {plan.features && plan.features.length > 0 && (
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <button
            onClick={() => onSelectPlan && onSelectPlan(plan)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Select Plan
          </button>
        </div>
      ))}
    </div>
  );
};

export default MembershipPlans;
