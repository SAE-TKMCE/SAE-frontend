import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/supabaseMock';
import { googleSheetsService } from '../../services/googleSheets';

const MembershipManagement = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [selectedMemberships, setSelectedMemberships] = useState([]);

  // CSS Animation Styles
  const styles = `
    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(25px, 25px); }
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .slide-in { animation: slideIn 0.3s ease-out; }
    .fade-in { animation: fadeIn 0.5s ease-out; }
  `;

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllMembers();
      setMemberships(data || []);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      setError('Failed to load memberships');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-500/20 text-green-300 border-green-400/30',
      'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      'inactive': 'bg-red-500/20 text-red-300 border-red-400/30',
      'suspended': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'approved': 'bg-green-500/20 text-green-300 border-green-400/30',
      'rejected': 'bg-red-500/20 text-red-300 border-red-400/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  };

  const getTeamColor = (team) => {
    const colors = {
      'VEGHA': 'bg-green-500/20 text-green-300 border-green-400/30',
      'HBAJA': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'MBAJA': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      'XLR8 Racing': 'bg-red-500/20 text-red-300 border-red-400/30',
      'XLR8FST': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'XLR8 E-racing': 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      'SPOX': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
    };
    return colors[team] || 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  };

  const handleStatusUpdate = async (membershipId, newStatus) => {
    try {
      // Update in main database
      await adminService.updateMemberStatus(membershipId, newStatus);
      
      // Update local state
      const updatedMembership = memberships.find(m => m.id === membershipId);
      setMemberships(memberships.map(m => 
        m.id === membershipId ? { ...m, membership_status: newStatus, is_approved: newStatus === 'approved' } : m
      ));
      
      // Sync with Google Sheets
      try {
        await googleSheetsService.updateMembershipStatus(membershipId, newStatus, updatedMembership);
        console.log('✅ Successfully synced to Google Sheets');
      } catch (syncError) {
        console.warn('⚠️ Google Sheets sync failed (continuing with local update):', syncError);
        // Show user notification but don't block the operation
      }
    } catch (error) {
      console.error('Error updating membership status:', error);
      setError('Failed to update membership status');
    }
  };

  const handleBulkAction = async (action) => {
    try {
      const promises = selectedMemberships.map(id => {
        const status = action === 'activate' ? 'active' : 
                     action === 'deactivate' ? 'inactive' :
                     action === 'approve' ? 'approved' : 'pending';
        return handleStatusUpdate(id, status);
      });
      
      await Promise.all(promises);
      setSelectedMemberships([]);

      // Bulk sync to Google Sheets
      try {
        const updatedMemberships = memberships.filter(m => selectedMemberships.includes(m.id));
        await googleSheetsService.bulkSyncMemberships(updatedMemberships);
        console.log('✅ Bulk sync to Google Sheets completed');
      } catch (syncError) {
        console.warn('⚠️ Google Sheets bulk sync failed:', syncError);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      setError('Bulk action failed');
    }
  };

  const handleExportToGoogleSheets = async () => {
    try {
      await googleSheetsService.bulkSyncMemberships(filteredMemberships);
      alert('✅ Successfully exported to Google Sheets!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Export to Google Sheets failed. Check console for details.');
    }
  };

  const handleExportToCSV = () => {
    googleSheetsService.exportToCSV(filteredMemberships);
  };

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = 
      membership.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.college_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || membership.membership_status === statusFilter;
    const matchesTeam = teamFilter === 'all' || membership.preferred_team === teamFilter;
    
    return matchesSearch && matchesStatus && matchesTeam;
  });

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'gridMove 20s ease-in-out infinite alternate'
              }}
            ></div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl animate-pulse">
              <span className="text-2xl">👥</span>
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mb-4"></div>
            <p className="text-gray-300 font-medium">Loading Memberships...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'gridMove 20s ease-in-out infinite alternate'
              }}
            ></div>
          </div>
          <div className="relative z-10 p-6">
            <div className="bg-red-900/50 backdrop-blur-xl border border-red-500/50 rounded-xl p-6 max-w-lg mx-auto">
              <div className="flex items-center mb-4">
                <span className="text-red-400 mr-3 text-2xl">⚠️</span>
                <div>
                  <h3 className="text-lg font-medium text-red-300">Error Loading Memberships</h3>
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchMemberships}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s ease-in-out infinite alternate'
            }}
          ></div>
        </div>

        <div className="relative z-10 p-6 space-y-6">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold text-white">👥</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2" style={{fontFamily: 'Almarai, sans-serif'}}>
              Membership Management
            </h1>
            <p className="text-gray-400 text-lg">Manage SAE TKMCE member status and details</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 slide-in">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Active Members</p>
                  <p className="text-3xl font-bold text-white">
                    {memberships.filter(m => m.membership_status === 'active' || m.membership_status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Pending</p>
                  <p className="text-3xl font-bold text-white">
                    {memberships.filter(m => m.membership_status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Inactive</p>
                  <p className="text-3xl font-bold text-white">
                    {memberships.filter(m => m.membership_status === 'inactive' || m.membership_status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total</p>
                  <p className="text-3xl font-bold text-white">{memberships.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 slide-in">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Team Filter */}
                <select
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                >
                  <option value="all">All Teams</option>
                  <option value="VEGHA">VEGHA</option>
                  <option value="HBAJA">HBAJA</option>
                  <option value="MBAJA">MBAJA</option>
                  <option value="XLR8 Racing">XLR8 Racing</option>
                  <option value="XLR8FST">XLR8FST</option>
                  <option value="XLR8 E-racing">XLR8 E-racing</option>
                  <option value="SPOX">SPOX</option>
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedMemberships.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    ✅ Approve ({selectedMemberships.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    🟢 Activate ({selectedMemberships.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    🔴 Deactivate ({selectedMemberships.length})
                  </button>
                </div>
              )}

              {/* Export Actions */}
              <div className="flex gap-2 border-l border-gray-600/50 pl-4">
                <button
                  onClick={handleExportToGoogleSheets}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  title="Export to Google Sheets"
                >
                  📊 Google Sheets
                </button>
                <button
                  onClick={handleExportToCSV}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  title="Export to CSV"
                >
                  📁 CSV Export
                </button>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden slide-in">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                        checked={selectedMemberships.length === filteredMemberships.length && filteredMemberships.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMemberships(filteredMemberships.map(m => m.id));
                          } else {
                            setSelectedMemberships([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      👤 Member
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      🎓 Academic
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      🏁 Team
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      📊 Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      📅 Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ⚙️ Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredMemberships.map((membership) => (
                    <tr key={membership.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                          checked={selectedMemberships.includes(membership.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMemberships([...selectedMemberships, membership.id]);
                            } else {
                              setSelectedMemberships(selectedMemberships.filter(id => id !== membership.id));
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {membership.first_name?.charAt(0)}{membership.last_name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {membership.first_name} {membership.last_name}
                            </div>
                            <div className="text-sm text-gray-400">{membership.email}</div>
                            <div className="text-xs text-gray-500">{membership.college_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{membership.branch || 'N/A'}</div>
                        <div className="text-xs text-gray-400">Year {membership.year_of_study || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {membership.preferred_team ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${getTeamColor(membership.preferred_team)}`}>
                            {membership.preferred_team}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">No team</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(membership.membership_status)}`}>
                          {membership.membership_status === 'active' && '🟢'}
                          {membership.membership_status === 'pending' && '⏳'}
                          {membership.membership_status === 'inactive' && '🔴'}
                          {membership.membership_status === 'approved' && '✅'}
                          {membership.membership_status === 'rejected' && '❌'}
                          {' '}{membership.membership_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(membership.date_joined || membership.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <select
                            className="text-xs px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded focus:ring-2 focus:ring-blue-500"
                            value={membership.membership_status}
                            onChange={(e) => handleStatusUpdate(membership.id, e.target.value)}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="approved">✅ Approved</option>
                            <option value="active">🟢 Active</option>
                            <option value="inactive">🔴 Inactive</option>
                            <option value="rejected">❌ Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMemberships.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">👥</span>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No members found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipManagement;
