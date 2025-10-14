import { useState, useEffect } from "react";
import { X, Activity, Search, Filter, Calendar, User, AlertCircle } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface UserActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

interface ActivityRecord {
  id: number;
  activity_type: string;
  description: string;
  metadata: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function UserActivityModal({
  isOpen,
  onClose,
  userId,
  userName,
}: UserActivityModalProps) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserActivity();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.activity_type === filterType);
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm, filterType]);

  const fetchUserActivity = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/activity`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
        setFilteredActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const activityTypes = [...new Set(activities.map(a => a.activity_type))];

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'login':
        return <User className="w-4 h-4" />;
      case 'booking_created':
      case 'booking_cancelled':
        return <Calendar className="w-4 h-4" />;
      case 'subscription_change':
      case 'payment_completed':
        return <Activity className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'login':
        return 'bg-blue-100 text-blue-600';
      case 'booking_created':
        return 'bg-green-100 text-green-600';
      case 'booking_cancelled':
        return 'bg-red-100 text-red-600';
      case 'subscription_change':
        return 'bg-purple-100 text-purple-600';
      case 'payment_completed':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">User Activity</h2>
                <p className="text-sm text-gray-600">{userName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Activities</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
              <div className="text-sm text-gray-600">Total Activities</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.created_at >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).length}
              </div>
              <div className="text-sm text-gray-600">Last 7 Days</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">
                {activityTypes.length}
              </div>
              <div className="text-sm text-gray-600">Activity Types</div>
            </div>
          </div>

          {/* Activity List */}
          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {activities.length === 0 ? 'No activity found' : 'No matching activities'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActivityColor(activity.activity_type)}`}>
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {activity.activity_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      
                      {/* Additional Details */}
                      <div className="mt-2 space-y-1">
                        {activity.ip_address && (
                          <div className="text-xs text-gray-500">
                            IP: {activity.ip_address}
                          </div>
                        )}
                        {activity.metadata && (
                          <div className="text-xs text-gray-500">
                            Details: {activity.metadata}
                          </div>
                        )}
                        {activity.user_agent && (
                          <details className="text-xs text-gray-500">
                            <summary className="cursor-pointer hover:text-gray-700">User Agent</summary>
                            <div className="mt-1 pl-2 border-l-2 border-gray-200">
                              {activity.user_agent}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
