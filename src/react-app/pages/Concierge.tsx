import { useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import ConciergeProviderModal from "@/react-app/components/ConciergeProviderModal";
import ConciergeStaffModal from "@/react-app/components/ConciergeStaffModal";
import ConciergeServiceModal from "@/react-app/components/ConciergeServiceModal";
import ConciergeRequestModal from "@/react-app/components/ConciergeRequestModal";
import DeleteConfirmModal from "@/react-app/components/DeleteConfirmModal";
import DataTable, { TableColumn } from "@/react-app/components/DataTable";
import { useServerSideTable } from "@/react-app/hooks/useServerSideTable";
import { 
  Building2,
  UserCheck, 
  Plus, 
  Settings, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Award
} from "lucide-react";
import type { 
  ConciergeServiceProvider,
  ConciergeStaff, 
  ConciergeService,
  ConciergeServiceProviderWithStats,
  ConciergeStaffWithStats,
  ConciergeRequestWithDetails
} from "@/shared/types";

// Define table columns for providers
const providerColumns: TableColumn<ConciergeServiceProviderWithStats>[] = [
  {
    key: 'name',
    title: 'Provider',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center space-x-3">
        {record.logo_url ? (
          <img
            src={record.logo_url}
            alt={record.name}
            className="w-10 h-10 object-cover rounded-lg"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          <div className="text-sm text-gray-500">{record.city || 'Location not set'}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'contact_email',
    title: 'Contact',
    render: (_, record) => (
      <div className="space-y-1">
        <div className="flex items-center space-x-1">
          <Mail className="w-4 h-4 text-gray-400" />
          <a
            href={`mailto:${record.contact_email}`}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            {record.contact_email}
          </a>
        </div>
        {record.contact_phone && (
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4 text-gray-400" />
            <a
              href={`tel:${record.contact_phone}`}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              {record.contact_phone}
            </a>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'specialties',
    title: 'Specialties',
    render: (specialties) => (
      <div className="text-sm text-gray-600">
        {specialties || 'General concierge services'}
      </div>
    ),
  },
  {
    key: 'stats',
    title: 'Performance',
    render: (_, record) => (
      <div className="space-y-1">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">
            {record.rating.toFixed(1)}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {record.stats.total_services} services, {record.stats.total_staff} staff
        </div>
      </div>
    ),
  },
  {
    key: 'commission_rate',
    title: 'Commission',
    sortable: true,
    render: (rate) => (
      <div className="text-sm font-medium">
        {rate}%
      </div>
    ),
  },
  {
    key: 'is_verified',
    title: 'Status',
    sortable: true,
    render: (_, record) => (
      <div className="space-y-1">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            record.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {record.is_active ? 'Active' : 'Inactive'}
        </span>
        {record.is_verified && (
          <div className="flex items-center space-x-1">
            <Award className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-blue-600">Verified</span>
          </div>
        )}
      </div>
    ),
  },
];

// Define table columns for staff
const staffColumns: TableColumn<ConciergeStaffWithStats>[] = [
  {
    key: 'name',
    title: 'Staff Member',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center space-x-3">
        {record.profile_image ? (
          <img
            src={record.profile_image}
            alt={record.name}
            className="w-10 h-10 object-cover rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          <div className="text-sm text-gray-500">{record.position}</div>
          {record.provider && (
            <div className="text-xs text-blue-600">{record.provider.name}</div>
          )}
        </div>
      </div>
    ),
  },
  {
    key: 'email',
    title: 'Contact',
    render: (_, record) => (
      <div className="space-y-1">
        <div className="flex items-center space-x-1">
          <Mail className="w-4 h-4 text-gray-400" />
          <a
            href={`mailto:${record.email}`}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            {record.email}
          </a>
        </div>
        {record.phone && (
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4 text-gray-400" />
            <a
              href={`tel:${record.phone}`}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              {record.phone}
            </a>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'specialties',
    title: 'Specialties',
    render: (specialties) => (
      <div className="text-sm text-gray-600">
        {specialties || 'General concierge services'}
      </div>
    ),
  },
  {
    key: 'hourly_rate',
    title: 'Rate',
    sortable: true,
    render: (rate) => (
      <div className="flex items-center space-x-1">
        <DollarSign className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium">
          {rate ? `₦${rate.toLocaleString()}/hr` : 'TBD'}
        </span>
      </div>
    ),
  },
  {
    key: 'rating',
    title: 'Performance',
    sortable: true,
    render: (_, record) => (
      <div className="space-y-1">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">
            {record.rating.toFixed(1)}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {record.stats.completed_requests} completed
        </div>
      </div>
    ),
  },
  {
    key: 'is_active',
    title: 'Status',
    sortable: true,
    render: (isActive) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

// Define table columns for services
const serviceColumns: TableColumn<ConciergeService>[] = [
  {
    key: 'name',
    title: 'Service',
    sortable: true,
    render: (_, record) => (
      <div>
        <div className="font-medium text-gray-900">{record.name}</div>
        <div className="text-sm text-gray-500">{record.category}</div>
      </div>
    ),
  },
  {
    key: 'description',
    title: 'Description',
    render: (description) => (
      <div className="text-sm text-gray-600 max-w-xs truncate">
        {description || 'No description'}
      </div>
    ),
  },
  {
    key: 'base_price',
    title: 'Price',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center space-x-1">
        <DollarSign className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium">
          {record.base_price 
            ? `₦${record.base_price.toLocaleString()}` 
            : 'Custom pricing'
          }
        </span>
        <span className="text-xs text-gray-500">/{record.price_type}</span>
      </div>
    ),
  },
  {
    key: 'duration_minutes',
    title: 'Duration',
    render: (duration) => (
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-sm">
          {duration ? `${duration} min` : 'Variable'}
        </span>
      </div>
    ),
  },
  {
    key: 'is_available',
    title: 'Status',
    sortable: true,
    render: (isAvailable) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          isAvailable
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {isAvailable ? 'Available' : 'Unavailable'}
      </span>
    ),
  },
];

// Define table columns for requests
const requestColumns: TableColumn<ConciergeRequestWithDetails>[] = [
  {
    key: 'title',
    title: 'Request',
    sortable: true,
    render: (_, record) => (
      <div>
        <div className="font-medium text-gray-900">{record.title}</div>
        <div className="text-sm text-gray-500">{record.request_type}</div>
      </div>
    ),
  },
  {
    key: 'concierge.name',
    title: 'Assigned To',
    render: (_, record) => (
      <div className="text-sm">
        {record.concierge ? (
          <span className="text-gray-900">{record.concierge.name}</span>
        ) : (
          <span className="text-gray-500">Unassigned</span>
        )}
      </div>
    ),
  },
  {
    key: 'preferred_date',
    title: 'Date & Time',
    sortable: true,
    render: (_, record) => (
      <div className="text-sm">
        {record.preferred_date ? (
          <div>
            <div>{new Date(record.preferred_date).toLocaleDateString()}</div>
            {record.preferred_time && (
              <div className="text-gray-500">{record.preferred_time}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-500">Flexible</span>
        )}
      </div>
    ),
  },
  {
    key: 'guest_count',
    title: 'Guests',
    render: (guestCount) => (
      <div className="flex items-center space-x-1">
        <Users className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{guestCount}</span>
      </div>
    ),
  },
  {
    key: 'total_cost',
    title: 'Cost',
    sortable: true,
    render: (cost) => (
      <div className="flex items-center space-x-1">
        <DollarSign className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium">
          {cost ? `₦${cost.toLocaleString()}` : 'TBD'}
        </span>
      </div>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    render: (status) => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'completed':
            return 'bg-green-100 text-green-800';
          case 'in_progress':
            return 'bg-blue-100 text-blue-800';
          case 'assigned':
            return 'bg-yellow-100 text-yellow-800';
          case 'pending':
            return 'bg-gray-100 text-gray-800';
          case 'cancelled':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };

      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
          {status.replace('_', ' ')}
        </span>
      );
    },
  },
];

export default function ConciergePage() {
  const [activeTab, setActiveTab] = useState<'providers' | 'staff' | 'services' | 'requests'>('providers');
  
  // Providers management
  const [providersTableState, providersTableActions] = useServerSideTable({
    endpoint: '/api/admin/concierge/providers',
    initialPageSize: 25,
  });
  
  // Staff management
  const [staffTableState, staffTableActions] = useServerSideTable({
    endpoint: '/api/admin/concierge/staff',
    initialPageSize: 25,
  });
  
  // Services management  
  const [servicesTableState, servicesTableActions] = useServerSideTable({
    endpoint: '/api/admin/concierge/services',
    initialPageSize: 25,
  });
  
  // Requests management
  const [requestsTableState, requestsTableActions] = useServerSideTable({
    endpoint: '/api/admin/concierge/requests',
    initialPageSize: 25,
  });

  const [providerModal, setProviderModal] = useState<{ isOpen: boolean; provider: ConciergeServiceProvider | null }>({
    isOpen: false,
    provider: null,
  });

  const [staffModal, setStaffModal] = useState<{ isOpen: boolean; staff: ConciergeStaff | null }>({
    isOpen: false,
    staff: null,
  });

  const [serviceModal, setServiceModal] = useState<{ isOpen: boolean; service: ConciergeService | null }>({
    isOpen: false,
    service: null,
  });

  const [requestModal, setRequestModal] = useState<{ isOpen: boolean; request: ConciergeRequestWithDetails | null }>({
    isOpen: false,
    request: null,
  });

  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    type: 'provider' | 'staff' | 'service' | 'request'; 
    item: any 
  }>({
    isOpen: false,
    type: 'provider',
    item: null,
  });

  const handleProviderUpdate = () => {
    providersTableActions.refresh();
    setProviderModal({ isOpen: false, provider: null });
  };

  const handleStaffUpdate = () => {
    staffTableActions.refresh();
    setStaffModal({ isOpen: false, staff: null });
  };

  const handleServiceUpdate = () => {
    servicesTableActions.refresh();
    setServiceModal({ isOpen: false, service: null });
  };

  const handleRequestUpdate = () => {
    requestsTableActions.refresh();
    setRequestModal({ isOpen: false, request: null });
  };

  const handleDelete = async () => {
    const { type, item } = deleteModal;
    const endpoints = {
      provider: '/api/admin/concierge/providers',
      staff: '/api/admin/concierge/staff',
      service: '/api/admin/concierge/services',
      request: '/api/admin/concierge/requests',
    };

    try {
      const response = await fetch(`${endpoints[type]}/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        if (type === 'provider') providersTableActions.refresh();
        if (type === 'staff') staffTableActions.refresh();
        if (type === 'service') servicesTableActions.refresh();
        if (type === 'request') requestsTableActions.refresh();
        setDeleteModal({ isOpen: false, type: 'provider', item: null });
      }
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const tabs = [
    { key: 'providers', label: 'Providers', icon: Building2 },
    { key: 'staff', label: 'Staff', icon: UserCheck },
    { key: 'services', label: 'Services', icon: Settings },
    { key: 'requests', label: 'Requests', icon: FileText },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Concierge Management</h1>
            <p className="text-gray-600 mt-2">Manage concierge staff, services, and customer requests</p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Providers</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {providersTableState.data.filter((provider: any) => provider.is_active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Services</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {servicesTableState.data.filter((service: any) => service.is_available).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {requestsTableState.data.filter((req: any) => ['pending', 'assigned', 'in_progress'].includes(req.status)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ₦{requestsTableState.data
                    .filter((req: any) => req.status === 'completed' && req.total_cost)
                    .reduce((sum: number, req: any) => sum + (req.total_cost || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Service Providers</h2>
                  <button
                    onClick={() => setProviderModal({ isOpen: true, provider: null })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Provider</span>
                  </button>
                </div>

                <DataTable
                  data={providersTableState.data}
                  columns={[
                    ...providerColumns,
                    {
                      key: 'actions',
                      title: 'Actions',
                      render: (_, record: ConciergeServiceProviderWithStats) => (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setProviderModal({ isOpen: true, provider: record })}
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                            title="Edit provider"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, type: 'provider', item: record })}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete provider"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  loading={providersTableState.loading}
                  totalItems={providersTableState.totalItems}
                  currentPage={providersTableState.currentPage}
                  pageSize={providersTableState.pageSize}
                  searchTerm={providersTableState.searchTerm}
                  sortConfig={providersTableState.sortConfig}
                  filters={providersTableState.filters}
                  onPageChange={providersTableActions.setPage}
                  onPageSizeChange={providersTableActions.setPageSize}
                  onSearchChange={providersTableActions.setSearch}
                  onSortChange={providersTableActions.setSort}
                  onFilterChange={providersTableActions.setFilters}
                  onRefresh={providersTableActions.refresh}
                  searchable={true}
                  searchPlaceholder="Search providers by name, email..."
                  filterOptions={{
                    is_active: [
                      { label: 'Active', value: '1' },
                      { label: 'Inactive', value: '0' }
                    ],
                    is_verified: [
                      { label: 'Verified', value: '1' },
                      { label: 'Unverified', value: '0' }
                    ]
                  }}
                  emptyState={{
                    icon: Building2,
                    title: 'No service providers yet',
                    description: 'Add concierge service providers to manage services',
                    action: (
                      <button
                        onClick={() => setProviderModal({ isOpen: true, provider: null })}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                      >
                        Add First Provider
                      </button>
                    )
                  }}
                />
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Concierge Staff</h2>
                  <button
                    onClick={() => setStaffModal({ isOpen: true, staff: null })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Staff</span>
                  </button>
                </div>

                <DataTable
                  data={staffTableState.data}
                  columns={[
                    ...staffColumns,
                    {
                      key: 'actions',
                      title: 'Actions',
                      render: (_, record: ConciergeStaffWithStats) => (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setStaffModal({ isOpen: true, staff: record })}
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                            title="Edit staff"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, type: 'staff', item: record })}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete staff"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  loading={staffTableState.loading}
                  totalItems={staffTableState.totalItems}
                  currentPage={staffTableState.currentPage}
                  pageSize={staffTableState.pageSize}
                  searchTerm={staffTableState.searchTerm}
                  sortConfig={staffTableState.sortConfig}
                  filters={staffTableState.filters}
                  onPageChange={staffTableActions.setPage}
                  onPageSizeChange={staffTableActions.setPageSize}
                  onSearchChange={staffTableActions.setSearch}
                  onSortChange={staffTableActions.setSort}
                  onFilterChange={staffTableActions.setFilters}
                  onRefresh={staffTableActions.refresh}
                  searchable={true}
                  searchPlaceholder="Search staff by name, email..."
                  filterOptions={{
                    is_active: [
                      { label: 'Active', value: '1' },
                      { label: 'Inactive', value: '0' }
                    ]
                  }}
                  emptyState={{
                    icon: UserCheck,
                    title: 'No staff members yet',
                    description: 'Add concierge staff to start managing services',
                    action: (
                      <button
                        onClick={() => setStaffModal({ isOpen: true, staff: null })}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                      >
                        Add First Staff Member
                      </button>
                    )
                  }}
                />
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Concierge Services</h2>
                  <button
                    onClick={() => setServiceModal({ isOpen: true, service: null })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                </div>

                <DataTable
                  data={servicesTableState.data}
                  columns={[
                    ...serviceColumns,
                    {
                      key: 'actions',
                      title: 'Actions',
                      render: (_, record: ConciergeService) => (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setServiceModal({ isOpen: true, service: record })}
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                            title="Edit service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, type: 'service', item: record })}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  loading={servicesTableState.loading}
                  totalItems={servicesTableState.totalItems}
                  currentPage={servicesTableState.currentPage}
                  pageSize={servicesTableState.pageSize}
                  searchTerm={servicesTableState.searchTerm}
                  sortConfig={servicesTableState.sortConfig}
                  filters={servicesTableState.filters}
                  onPageChange={servicesTableActions.setPage}
                  onPageSizeChange={servicesTableActions.setPageSize}
                  onSearchChange={servicesTableActions.setSearch}
                  onSortChange={servicesTableActions.setSort}
                  onFilterChange={servicesTableActions.setFilters}
                  onRefresh={servicesTableActions.refresh}
                  searchable={true}
                  searchPlaceholder="Search services by name, category..."
                  filterOptions={{
                    is_available: [
                      { label: 'Available', value: '1' },
                      { label: 'Unavailable', value: '0' }
                    ],
                    category: [
                      { label: 'VIP Services', value: 'vip' },
                      { label: 'Transportation', value: 'transport' },
                      { label: 'Dining', value: 'dining' },
                      { label: 'Entertainment', value: 'entertainment' },
                      { label: 'Other', value: 'other' }
                    ]
                  }}
                  emptyState={{
                    icon: Settings,
                    title: 'No services available',
                    description: 'Create concierge services for your customers',
                    action: (
                      <button
                        onClick={() => setServiceModal({ isOpen: true, service: null })}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                      >
                        Add First Service
                      </button>
                    )
                  }}
                />
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Service Requests</h2>
                </div>

                <DataTable
                  data={requestsTableState.data}
                  columns={[
                    ...requestColumns,
                    {
                      key: 'actions',
                      title: 'Actions',
                      render: (_, record: ConciergeRequestWithDetails) => (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setRequestModal({ isOpen: true, request: record })}
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                            title="View/Edit request"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, type: 'request', item: record })}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  loading={requestsTableState.loading}
                  totalItems={requestsTableState.totalItems}
                  currentPage={requestsTableState.currentPage}
                  pageSize={requestsTableState.pageSize}
                  searchTerm={requestsTableState.searchTerm}
                  sortConfig={requestsTableState.sortConfig}
                  filters={requestsTableState.filters}
                  onPageChange={requestsTableActions.setPage}
                  onPageSizeChange={requestsTableActions.setPageSize}
                  onSearchChange={requestsTableActions.setSearch}
                  onSortChange={requestsTableActions.setSort}
                  onFilterChange={requestsTableActions.setFilters}
                  onRefresh={requestsTableActions.refresh}
                  searchable={true}
                  searchPlaceholder="Search requests by title, type..."
                  filterOptions={{
                    status: [
                      { label: 'Pending', value: 'pending' },
                      { label: 'Assigned', value: 'assigned' },
                      { label: 'In Progress', value: 'in_progress' },
                      { label: 'Completed', value: 'completed' },
                      { label: 'Cancelled', value: 'cancelled' }
                    ],
                    priority: [
                      { label: 'Low', value: 'low' },
                      { label: 'Normal', value: 'normal' },
                      { label: 'High', value: 'high' },
                      { label: 'Urgent', value: 'urgent' }
                    ]
                  }}
                  emptyState={{
                    icon: FileText,
                    title: 'No service requests',
                    description: 'Customer service requests will appear here'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <ConciergeProviderModal
          isOpen={providerModal.isOpen}
          onClose={() => setProviderModal({ isOpen: false, provider: null })}
          provider={providerModal.provider}
          onUpdate={handleProviderUpdate}
        />

        <ConciergeStaffModal
          isOpen={staffModal.isOpen}
          onClose={() => setStaffModal({ isOpen: false, staff: null })}
          staff={staffModal.staff}
          onUpdate={handleStaffUpdate}
        />

        <ConciergeServiceModal
          isOpen={serviceModal.isOpen}
          onClose={() => setServiceModal({ isOpen: false, service: null })}
          service={serviceModal.service}
          onUpdate={handleServiceUpdate}
        />

        <ConciergeRequestModal
          isOpen={requestModal.isOpen}
          onClose={() => setRequestModal({ isOpen: false, request: null })}
          request={requestModal.request}
          onUpdate={handleRequestUpdate}
        />

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, type: 'provider', item: null })}
          onConfirm={handleDelete}
          title={`Delete ${deleteModal.type}`}
          message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
          itemName={deleteModal.item?.name || deleteModal.item?.title || ''}
        />
      </div>
    </AdminLayout>
  );
}
