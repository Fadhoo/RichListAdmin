/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import UserEditModal from "@/react-app/components/UserEditModal";
import UserInviteModal from "@/react-app/components/UserInviteModal";
import SubscriptionHistoryModal from "@/react-app/components/SubscriptionHistoryModal";
import UserActivityModal from "@/react-app/components/UserActivityModal";
// import WalletManagementModal from "@/react-app/components/WalletManagementModal";
import DataTable, { TableColumn } from "@/react-app/components/DataTable";
// import { useServerSideTable } from "@/react-app/hooks/useServerSideTable";
import { Users, Shield, Activity, Eye, Ban, UserPlus, UserCheck, Edit, Wallet } from "lucide-react";
import { useUsers } from "../hooks/useUsers";

// Remove local User definition if not needed, or update imports to use shared types if required elsewhere
// import type { User } from "@/react-app/types/User";

// Remove local UserWithStats definition and import the shared type instead
import type { UserWithStats } from "@/react-app/types/userWithStats";
import { editUser } from "../api/users";

// Define table columns
const userColumns: TableColumn<UserWithStats>[] = [
  {
    key: 'name',
    title: 'User',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full"
          src={record.picture || 'https://via.placeholder.com/40'}
          alt="Profile"
        />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {record.name}
          </div>
          <div className="text-sm text-gray-500">
            {record.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'wallet.balance',
    title: 'Wallet',
    render: (_, record) => (
      <div className="flex items-center space-x-1">
        <Wallet className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-900">
          ₦{(record.walletId?.balance || 0).toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    key: 'isActive',
    title: 'Status',
    sortable: true,
    render: (value) => {
      const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      };

      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    key: 'createdAt',
    title: 'Joined',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString(),
  },
];

export default function UsersPage() {
   const usersResult = useUsers({});
    const [tableState, tableActions] = Array.isArray(usersResult) ? usersResult : [{ data: [], loading: true, totalItems: 0, currentPage: 1, pageSize: 10, searchTerm: '', sortConfig: undefined, filters: {} }, { refresh: async () => {}} ];

  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [subscriptionHistoryModal, setSubscriptionHistoryModal] = useState<{ isOpen: boolean; user: UserWithStats | null }>({
    isOpen: false,
    user: null,
  });
  const [activityModal, setActivityModal] = useState<{ isOpen: boolean; user: UserWithStats | null }>({
    isOpen: false,
    user: null,
  });

  // Wallet modal state (currently not in use but kept for future implementation)
  const [, setWalletModal] = useState<{ isOpen: boolean; user: UserWithStats | null }>({
    isOpen: false,
    user: null,
  });

  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        credentials: 'include',
      });
      if (response.ok) {
        await response.json();
        setAnalytics({
          totalUsers: tableState.totalItems,
          activeUsers:  usersResult[0]?.users.filter((u: any) => u.isActive).length ,
          totalRevenue: usersResult[0]?.users.reduce((sum: number, user: any) => sum + (user.stats.total_spent || 0), 0),
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await editUser(userId, { isActive });

      if (response.status === 200 || response.status === 204) {
        tableActions.refresh(); // Refresh the table data
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: UserWithStats | null }>({
    isOpen: false,
    user: null,
  });

  const handleUserUpdate = () => {
    tableActions.refresh(); // Refresh the table data
    setEditModal({ isOpen: false, user: null });
  };

  const handleUserInvite = async (emails: string[], role: string, subscriptionPlan: string) => {
    try {
      const response = await fetch('/api/admin/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          emails,
          role,
          subscription_plan: subscriptionPlan,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully sent ${result.sent} invitation(s)`);
        tableActions.refresh(); // Refresh to show any immediately created users
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invitations');
      }
    } catch (error) {
      console.error('Failed to send invitations:', error);
      throw error;
    }
  };

  

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage users, subscriptions, and activity</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setInviteModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              <span>Invite User</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    tableState.totalItems.toLocaleString()
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    usersResult[0]?.users.filter((u: any) => u.isActive).length
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platinum Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    usersResult[0]?.users.filter((u: any) => u.subscription?.plan_type === 'platinum').length
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div> */}
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                {/* <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    `₦${usersResult[0]?.users.reduce((sum: number, user: any) => sum + (user.stats.total_spent || 0), 0).toLocaleString()}`
                  )}
                </p> */}
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <DataTable
          data={(usersResult[0]?.users || []) as any}
          columns={[
            ...userColumns,
            {
              key: 'actions',
              title: 'Actions',
              render: (_, record: UserWithStats) => (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedUser(record);
                      setShowUserModal(true);
                    }}
                    className="text-purple-600 hover:text-purple-900"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditModal({ isOpen: true, user: record });
                    }}
                    className="text-gray-600 hover:text-purple-900"
                    title="Edit user"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateUserStatus(record._id, !record.isActive)}
                    className={record.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                    title={record.isActive ? "Deactivate user" : "Activate user"}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActivityModal({ isOpen: true, user: record });
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View user activity"
                  >
                  </button>
                  <button
                  //  onClick={ 
                  //   () => {}
                  //  }
                    onClick={() => {
                      setWalletModal({ isOpen: true, user: record });
                    }}
                    className="text-green-600 hover:text-green-900"
                    title="Manage wallet"
                  >
                    <Wallet className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
          loading={tableState.loading}
          totalItems={tableState.totalItems}
          currentPage={tableState.currentPage}
          pageSize={tableState.pageSize}
          searchTerm={tableState.searchTerm}
          sortConfig={tableState.sortConfig}
          filters={tableState.filters}
          onPageChange={tableActions.setPage ?? (() => {})}
          onPageSizeChange={tableActions.setPageSize ?? (() => {})}
          onSearchChange={tableActions.setSearch ?? (() => {})}
          onSortChange={tableActions.setSort ?? (() => {})}
          onFilterChange={tableActions.setFilters ?? (() => {})}
          onRefresh={tableActions.refresh ?? (() => {})}
          onExport={tableActions.exportData ?? (() => {})}
          searchable={true}
          searchPlaceholder="Search users by name, email..."
          filterOptions={{
            isActive: [
              { label: 'Active', value: '1' },
              { label: 'Inactive', value: '0' }
            ],
          }}
          emptyState={{
            icon: UserCheck,
            title: tableState.searchTerm || Object.values(tableState.filters).some(f => f && f !== 'all') ? 'No matching users' : 'No users yet',
            description: tableState.searchTerm || Object.values(tableState.filters).some(f => f && f !== 'all') 
              ? 'Try adjusting your search or filter criteria'
              : 'Users will appear here when they sign up'
          }}
        />

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-16 h-16 rounded-full"
                      src={selectedUser.picture || 'https://via.placeholder.com/64'}
                      alt="Profile"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* User Stats */}
                <div className="grid grid-cols-4 gap-4">
                  {/* <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-xl font-bold text-gray-900">{selectedUser.stats.total_bookings}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-xl font-bold text-gray-900">₦{selectedUser.stats.total_spent}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Events Created</p>
                    <p className="text-xl font-bold text-gray-900">{selectedUser.stats.events_created}</p>
                  </div> */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Wallet Balance</p>
                    <p className="text-xl font-bold text-green-700">₦{(selectedUser.walletId?.balance || 0).toLocaleString()}</p>
                  </div>
                </div>

                {/* Recent Activity */}
                {/* <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  {selectedUser.recent_activity.length === 0 ? (
                    <p className="text-gray-500">No recent activity</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedUser.recent_activity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.activity_type}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        )}

        {/* User Edit Modal */}
        <UserEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, user: null })}
          user={editModal.user as any}
          onUpdate={handleUserUpdate}
        />

        {/* User Invite Modal */}
        <UserInviteModal
          isOpen={inviteModal}
          onClose={() => setInviteModal(false)}
          onInvite={handleUserInvite}
        />

        {/* Subscription History Modal */}
        <SubscriptionHistoryModal
          isOpen={subscriptionHistoryModal.isOpen}
          onClose={() => setSubscriptionHistoryModal({ isOpen: false, user: null })}
          userId={subscriptionHistoryModal.user?._id || ''}
          userName={subscriptionHistoryModal.user?.name || 'Unknown User'}
        />

        {/* User Activity Modal */}
        <UserActivityModal
          isOpen={activityModal.isOpen}
          onClose={() => setActivityModal({ isOpen: false, user: null })}
          userId={activityModal.user?._id || ''}
          userName={activityModal.user?.name || 'Unknown User'}
        />

        {/* Wallet Management Modal */}
        {/* <WalletManagementModal
          isOpen={walletModal.isOpen}
          onClose={() => setWalletModal({ isOpen: false, user: null })}
          user={walletModal.user}
          onWalletUpdate={() => {
            tableActions.refresh();
            setWalletModal({ isOpen: false, user: null });
          }}
        /> */}
      </div>
    </AdminLayout>
  );
}
