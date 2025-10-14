import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import LoadingSpinner from "@/react-app/components/LoadingSpinner";
import { MapPin, Calendar, Users, DollarSign, TrendingUp, Clock, BookOpen } from "lucide-react";

interface Analytics {
  stats: {
    venues: number;
    events: number;
    stories: number;
    bookings: number;
    revenue: number;
  };
  recentBookings: Array<{
    id: number;
    event_title: string;
    venue_name: string;
    guest_count: number;
    total_amount: number;
    created_at: string;
    booking_status: string;
  }>;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner size="lg" className="h-64" />
      </AdminLayout>
    );
  }

  const stats = [
    {
      name: 'Total Venues',
      value: analytics?.stats.venues || 0,
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Active Events',
      value: analytics?.stats.events || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+8%',
    },
    {
      name: 'Published Stories',
      value: analytics?.stats.stories || 0,
      icon: BookOpen,
      color: 'bg-indigo-500',
      change: '+18%',
    },
    {
      name: 'Total Bookings',
      value: analytics?.stats.bookings || 0,
      icon: Users,
      color: 'bg-green-500',
      change: '+23%',
    },
    {
      name: 'Revenue',
      value: `₦${(analytics?.stats.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+15%',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your RichList admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Last updated: now</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {analytics?.recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics?.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{booking.event_title}</h3>
                      <p className="text-sm text-gray-600">{booking.venue_name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(booking.created_at).toLocaleDateString()} • {booking.guest_count} guests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₦{booking.total_amount}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        booking.booking_status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.booking_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
