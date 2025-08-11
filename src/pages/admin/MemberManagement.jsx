import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/supabaseMock';
import { imageHelpers } from '../../services/imagekit';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  // Bulk actions UI can be added later
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (memberId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [memberId]: true }));
      await adminService.updateMemberStatus(memberId, newStatus);
      
      // Update local state
      setMembers(prevMembers =>
        prevMembers.map(member =>
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );
      
      // Show success message
      alert(`Member status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating member status:', error);
      alert('Failed to update member status');
    } finally {
      setActionLoading(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedMembers.length === 0) return;
    
    try {
      setLoading(true);
      const promises = selectedMembers.map(memberId =>
        adminService.updateMemberStatus(memberId, newStatus)
      );
      
      await Promise.all(promises);
      
      // Update local state
      setMembers(prevMembers =>
        prevMembers.map(member =>
          selectedMembers.includes(member.id)
            ? { ...member, status: newStatus }
            : member
        )
      );
      
  setSelectedMembers([]);
      alert(`${selectedMembers.length} members updated to ${newStatus}`);
    } catch (error) {
      console.error('Error bulk updating members:', error);
      alert('Failed to update members');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [memberId]: true }));
      await adminService.deleteMember(memberId);
      
      // Remove from local state
      setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
      alert('Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    } finally {
      setActionLoading(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleSelectAll = () => {
    const filteredMembers = getFilteredMembers();
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  const getFilteredMembers = () => {
    let filtered = members;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(member => member.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.college_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      approved: '✅',
      rejected: '❌',
      inactive: '⏸️'
    };
    return icons[status] || '❓';
  };

  const filteredMembers = getFilteredMembers();

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <span className="text-red-400 mr-2">⚠️</span>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchMembers}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Member Management</h1>
            <p className="text-blue-100">Manage membership applications and member status</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/admin/forms/membership"
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
            >
              <span>⚙️</span>
              <span>Configure Form</span>
            </Link>
            <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200 flex items-center space-x-2">
              <span>📊</span>
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['pending', 'approved', 'rejected', 'inactive'].map(status => {
          const count = members.filter(member => member.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${getStatusColor(status)}`}>
                  <span className="text-2xl">{getStatusIcon(status)}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="first_name-asc">Name A-Z</option>
              <option value="first_name-desc">Name Z-A</option>
              <option value="status-asc">Status A-Z</option>
            </select>
          </div>
        </div>

        {selectedMembers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedMembers.length} member(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('approved')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('rejected')}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  ❌ Reject
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('inactive')}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  ⏸️ Deactivate
                </button>
                <button
                  onClick={() => setSelectedMembers([])}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMemberSelection(member.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={member.avatar_url ? imageHelpers.getMemberAvatar(member, 'small') : '/images/placeholders/avatar-small.jpg'}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.first_name} {member.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.preferred_team && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {member.preferred_team}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.college_id}</div>
                    <div className="text-sm text-gray-500">
                      {member.year_of_study && `Year ${member.year_of_study}`} • {member.branch}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {getStatusIcon(member.status)} {member.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {member.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(member.id, 'approved')}
                            disabled={actionLoading[member.id]}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50"
                            title="Approve"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => handleStatusChange(member.id, 'rejected')}
                            disabled={actionLoading[member.id]}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Reject"
                          >
                            ❌
                          </button>
                        </>
                      )}
                      {member.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(member.id, 'inactive')}
                          disabled={actionLoading[member.id]}
                          className="text-gray-600 hover:text-gray-700 disabled:opacity-50"
                          title="Deactivate"
                        >
                          ⏸️
                        </button>
                      )}
                      {member.status === 'inactive' && (
                        <button
                          onClick={() => handleStatusChange(member.id, 'approved')}
                          disabled={actionLoading[member.id]}
                          className="text-green-600 hover:text-green-700 disabled:opacity-50"
                          title="Activate"
                        >
                          ▶️
                        </button>
                      )}
                      <Link
                        to={`/admin/members/${member.id}`}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Details"
                      >
                        👁️
                      </Link>
                      <button
                        onClick={() => handleDelete(member.id)}
                        disabled={actionLoading[member.id]}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No members have been registered yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberManagement;
