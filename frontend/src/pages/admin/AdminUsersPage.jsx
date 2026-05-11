import { useState, useEffect } from 'react';
import { Search, Users, Shield, Trash2, ChevronLeft, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useDebounce } from '../../hooks/useDebounce';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const debouncedSearch = useDebounce(searchTerm, 300);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/admin/users', {
        params: {
          page: currentPage,
          limit: usersPerPage,
          search: debouncedSearch
        }
      });
      setUsers(res.data.data?.users || []);
      setTotalPages(res.data.data?.totalPages || 1);
      setTotalUsers(res.data.data?.total || 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/api/admin/users/${userId}`, { role: newRole });
      setMessage({ type: 'success', text: 'User role updated successfully' });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update user role' });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/api/admin/users/${userToDelete._id}`);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      setShowDeleteDialog(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete user' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
          <p className="text-text-secondary mt-1">Manage platform users and permissions</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-blue-900">{totalUsers} Total Users</span>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl animate-fade-in ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search users by name or email..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No users found</h3>
            <p className="text-text-secondary">Try a different search term</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">User</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Trips</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-text-secondary text-sm">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 border-purple-200'
                              : 'bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                          {user.tripCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-text-secondary text-sm">{formatDate(user.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteDialog(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && userToDelete && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete.name}? This will permanently delete their account and all associated data including trips, budgets, and notes. This action cannot be undone.`}
          confirmLabel="Delete User"
          cancelLabel="Cancel"
          variant="danger"
        />
      )}
    </div>
  );
}
