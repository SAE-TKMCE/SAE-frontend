import React, { useState } from 'react';

const AdminDashboardDemo = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Sample pending users data
  const pendingUsers = [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@student.tkmce.ac.in",
      phone: "+91 9876543210",
      preferred_team: "XLR8 Racing",
      branch: "Mechanical Engineering",
      year_of_study: "3rd Year",
      college_id: "TKM21ME001",
      membership_status: "pending",
      is_approved: false,
      interests: "Formula racing, vehicle dynamics",
      skills: "CAD design, mechanical analysis",
      experience: "Built a go-kart in 2nd year"
    },
    {
      id: 2,
      first_name: "Priya",
      last_name: "Sharma",
      email: "priya.sharma@student.tkmce.ac.in",
      phone: "+91 9876543211",
      preferred_team: "VEGHA",
      branch: "Electrical Engineering",
      year_of_study: "2nd Year",
      college_id: "TKM21EE045",
      membership_status: "pending",
      is_approved: false,
      interests: "Electric vehicles, battery technology",
      skills: "Circuit design, programming",
      experience: "Worked on electric bike project"
    },
    {
      id: 3,
      first_name: "Rahul",
      last_name: "Kumar",
      email: "rahul.kumar@student.tkmce.ac.in",
      phone: "+91 9876543212",
      preferred_team: "HBAJA",
      branch: "Automobile Engineering",
      year_of_study: "4th Year",
      college_id: "TKM21AU012",
      membership_status: "pending",
      is_approved: false,
      interests: "Off-road vehicles, suspension systems",
      skills: "Welding, fabrication, testing",
      experience: "Team leader of college off-road club"
    }
  ];

  // Sample pending event registrations
  const pendingEventRegistrations = [
    {
      id: 1,
      user: {
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice.johnson@student.tkmce.ac.in",
        preferred_team: "XLR8 E-racing"
      },
      event: {
        title: "Formula SAE Workshop",
        date: "2025-07-25"
      },
      registration_date: "2025-07-15",
      status: "pending"
    },
    {
      id: 2,
      user: {
        first_name: "Bob",
        last_name: "Smith",
        email: "bob.smith@student.tkmce.ac.in",
        preferred_team: "MBAJA"
      },
      event: {
        title: "Baja SAE Competition Training",
        date: "2025-08-01"
      },
      registration_date: "2025-07-14",
      status: "pending"
    }
  ];

  const getTeamColor = (teamName) => {
    const colors = {
      'VEGHA': 'bg-green-100 text-green-800',
      'HBAJA': 'bg-red-100 text-red-800',
      'MBAJA': 'bg-orange-100 text-orange-800',
      'XLR8 Racing': 'bg-blue-100 text-blue-800',
      'XLR8FST': 'bg-purple-100 text-purple-800',
      'XLR8 E-racing': 'bg-yellow-100 text-yellow-800',
      'SPOX': 'bg-pink-100 text-pink-800',
    };
    return colors[teamName] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage member approvals and event registrations</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">📍 How to Access:</p>
            <p className="text-blue-700 mt-1">
              1. Login as admin@tkmce.ac.in<br/>
              2. Click "Admin" button in navbar<br/>
              3. This page will show all pending approvals
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Pending Members</h3>
            <p className="text-3xl font-bold text-red-600">{pendingUsers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Pending Events</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingEventRegistrations.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Approved Today</h3>
            <p className="text-3xl font-bold text-green-600">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Total Members</h3>
            <p className="text-3xl font-bold text-blue-600">127</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Member Approvals ({pendingUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📅 Event Registrations ({pendingEventRegistrations.length})
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">👥 Pending Member Approvals</h2>
              <p className="text-sm text-gray-600 mt-1">These users are waiting for admin approval to join SAE TKMCE</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preferred Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academic Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills & Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTeamColor(user.preferred_team)}`}>
                          {user.preferred_team}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.branch}</div>
                        <div className="text-sm text-gray-500">{user.year_of_study}</div>
                        <div className="text-sm text-gray-500">{user.college_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          <div className="mb-1"><strong>Interests:</strong> {user.interests}</div>
                          <div className="mb-1"><strong>Skills:</strong> {user.skills}</div>
                          <div><strong>Experience:</strong> {user.experience}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition duration-200"
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 transition duration-200"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">📅 Pending Event Registrations</h2>
              <p className="text-sm text-gray-600 mt-1">These users have registered for events and are waiting for approval</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingEventRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.user.first_name} {registration.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{registration.user.email}</div>
                          {registration.user.preferred_team && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getTeamColor(registration.user.preferred_team)}`}>
                              {registration.user.preferred_team}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{registration.event.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(registration.event.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.registration_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition duration-200"
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 transition duration-200"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardDemo;
