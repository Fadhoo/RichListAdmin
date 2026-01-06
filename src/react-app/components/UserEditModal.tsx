import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { User } from "../types/users";

interface UserWithStats extends User {
  id: string;
  email: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  walletId?: {
    id: number;
    balance: number;
    currency: string;
    isActive: boolean;
  };
  stats: {
    total_bookings: number;
    total_spent: number;
    events_created: number;
  };
  recent_activity: Array<{
    activity_type: string;
    description: string;
    created_at: string;
  }>;
}

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithStats | null;
  onUpdate: (user: UserWithStats) => void;
}

interface UpdateUserData {
  email?: string;
  isActive?: boolean;
}

export default function UserEditModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: UserEditModalProps) {
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        isActive: user.isActive,
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Merge with existing user data to preserve stats and other info
        const fullUpdatedUser = {
          ...user,
          ...updatedUser,
        };
        onUpdate(fullUpdatedUser);
        onClose();
      } else {
        const error = await response.json();
        setErrors({ general: error.error || 'Failed to update user' });
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      setErrors({ general: 'Failed to update user' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* <img
                className="w-10 h-10 rounded-full"
                src={user.google_user_data.picture || 'https://via.placeholder.com/40'}
                alt="Profile"
              /> */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="font-medium text-gray-900">User Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">User ID:</span>
                <span className="ml-2 font-mono">{user.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Joined:</span>
                <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Login:</span>
                <span className="ml-2">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
              </div>
              {/* <div>
                <span className="text-gray-600">Google Name:</span>
                <span className="ml-2">{user.google_user_data.name}</span>
              </div> */}
            </div>
          </div>

          {/* User Stats */}
          {/* <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-3">User Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{user.stats.total_bookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₦{user.stats.total_spent}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.stats.events_created}</div>
                <div className="text-sm text-gray-600">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">₦{(user.walletId?.balance || 0).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Wallet Balance</div>
              </div>
            </div>
          </div> */}

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="user@example.com"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Account Status</h3>
                <p className="text-sm text-gray-600">
                  {formData.isActive ? 'Account is active and can access the platform' : 'Account is deactivated and cannot access the platform'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                  disabled={loading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
