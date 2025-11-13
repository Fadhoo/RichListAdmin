import { useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import DeleteConfirmModal from "@/react-app/components/DeleteConfirmModal";
import VenueEditModal from "@/react-app/components/VenueEditModal";
import VenueProductsModal from "@/react-app/components/VenueProductsModal";
import DataTable, { TableColumn } from "@/react-app/components/DataTable";
import { createVenue, deleteVenue } from "../api/venues";
import { useVenues } from "@/react-app/hooks/useVenues";
import { Plus, MapPin, Users, Phone, Mail, Trash2, Edit, Wine } from "lucide-react";
import type { Venue, CreateVenue } from "../types/venue";
import ImageUpload from "@/react-app/components/ImageUpload";

// Define table columns
const venueColumns: TableColumn<Venue>[] = [
  {
    key: 'name',
    title: 'Venue',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center space-x-3">
        {record.imageId ? (
          <img
            src={record.imageId}
            alt={record.name}
            className="w-12 h-12 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white opacity-50" />
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          {record.desc && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {record.desc}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    key: 'city',
    title: 'Location',
    sortable: true,
    render: (_, record) => (
      <div className="text-sm">
        <div className="text-gray-900">{record.city || 'Lagos'}</div>
        {record.location && (
          <div className="text-gray-500 truncate max-w-xs">{record.location}</div>
        )}
      </div>
    ),
  },
  {
    key: 'capacity',
    title: 'Capacity',
    sortable: true,
    render: (capacity) => (
      <div className="flex items-center space-x-1">
        <Users className="w-4 h-4 text-gray-400" />
        <span>{capacity || 'N/A'}</span>
      </div>
    ),
  },
  {
    key: 'email',
    title: 'Contact',
    render: (_, record) => (
      <div className="text-sm space-y-1">
        {record.email && (
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4 text-gray-400" />
            <a
              href={`mailto:${record.email}`}
              className="text-purple-600 hover:text-purple-800"
            >
              {record.email}
            </a>
          </div>
        )}
        {record.phone && (
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4 text-gray-400" />
            <a
              href={`tel:${record.phone}`}
              className="text-purple-600 hover:text-purple-800"
            >
              {record.phone}
            </a>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'isActive',
    title: 'Active Status',
    sortable: true,
    render: (isActive) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    key: 'createdAt',
    title: 'Created',
    sortable: true,
    render: (createdAt) => new Date(createdAt).toLocaleDateString(),
  },
];

export default function VenuesPage() {
  const venuesResult = useVenues({});
  const [tableState, tableActions] = Array.isArray(venuesResult) ? venuesResult : [{ data: [], loading: true, totalItems: 0, currentPage: 1, pageSize: 10, searchTerm: '', sortConfig: {}, filters: {} }, {}];
  const refresh = tableActions.refresh;

  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; venue: Venue | null }>({
    isOpen: false,
    venue: null,
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; venue: Venue | null }>({
    isOpen: false,
    venue: null,
  });
  const [productsModal, setProductsModal] = useState<{ isOpen: boolean; venue: Venue | null }>({
    isOpen: false,
    venue: null,
  });
  const [formData, setFormData] = useState<CreateVenue>({
    name: '',
    desc: '',
    location: '',
    city: '',
    phone: '',
    email: '',
    imageId: '',
    capacity: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const response = await createVenue(formData);

      if (response.status === 200) {
        await response.data.  json();
        refresh(); // Refresh the table data
        setShowForm(false);
        setFormData({
          name: '',
          desc: '',
          location: '',
          city: '',
          phone: '',
          email: '',
          imageId: '',
          capacity: undefined,
        });
      }
    } catch (error) {
      console.error('Failed to create venue:', error);
    }
  };

  const handleUpdate = () => {
    tableActions.refresh(); // Refresh the table data
    setEditModal({ isOpen: false, venue: null });
  };

  const handleDelete = async (venue: Venue) => {
    try {
      const response = await deleteVenue(venue.id.toString());
      if (response.status === 200) {
        tableActions.refresh(); // Refresh the table data
        setDeleteModal({ isOpen: false, venue: null });
      }
    } catch (error) {
      console.error('Failed to delete venue:', error);
    }
  };

  

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Venues</h1>
            <p className="text-gray-600 mt-2">Manage your nightlife venues</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Venue</span>
          </button>
        </div>

        {/* Add Venue Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Venue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter venue name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the venue..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Max capacity"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Image
                </label>
                <ImageUpload
                  onUpload={(url) => setFormData({ ...formData, imageId: url })}
                  currentImage={formData.imageId}
                  maxSizeMB={10}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Add Venue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Venues Table */}
        <DataTable
          data={venuesResult[0]?.venues || []} // ensures data is always an array
          columns={[
            ...venueColumns,
            {
              key: 'actions',
              title: 'Actions',
              render: (_, record: Venue) => (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setProductsModal({ isOpen: true, venue: record })}
                    className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                    title="Manage products"
                  >
                    <Wine className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditModal({ isOpen: true, venue: record })}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                    title="Edit venue"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, venue: record })}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Delete venue"
                  >
                    <Trash2 className="w-4 h-4" />
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
          sortConfig={tableState.sortConfig as { key: string; direction: 'asc' | 'desc' } | null}
          filters={tableState.filters}
          onPageChange={tableActions.setPage ?? (() => {})}
          onPageSizeChange={tableActions.setPageSize ?? (() => {})}
          onSearchChange={tableActions.setSearch ?? (() => {})}
          onSortChange={tableActions.setSort ?? (() => {})}
          onFilterChange={tableActions.setFilters ?? (() => {})}
          onRefresh={tableActions.refresh}
          onExport={tableActions.exportData}
          searchable={true}
          searchPlaceholder="Search venues by name, city, address..."
          filterOptions={{
            is_verified: [
              { label: 'Verified', value: '1' },
              { label: 'Unverified', value: '0' }
            ]
          }}
          emptyState={{
            icon: MapPin,
            title: tableState.searchTerm || Object.values(tableState.filters).some(f => f && f !== 'all') ? 'No matching venues' : 'No venues yet',
            description: tableState.searchTerm || Object.values(tableState.filters).some(f => f && f !== 'all') ? 'Try adjusting your search or filter criteria' : 'Get started by adding your first venue',
            action: !tableState.searchTerm && !Object.values(tableState.filters).some(f => f && f !== 'all') ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Add Your First Venue
              </button>
            ) : undefined
          }}
        />

        {/* Edit Venue Modal */}
        <VenueEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, venue: null })}
          venue={editModal.venue}
          onUpdate={handleUpdate}
        />

        {/* Venue Products Modal */}
        <VenueProductsModal
          isOpen={productsModal.isOpen}
          onClose={() => setProductsModal({ isOpen: false, venue: null })}
          venue={productsModal.venue}
          onUpdate={handleUpdate}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, venue: null })}
          onConfirm={() => deleteModal.venue && handleDelete(deleteModal.venue)}
          title="Delete Venue"
          message="Are you sure you want to delete this venue? This action cannot be undone and will affect all associated events."
          itemName={deleteModal.venue?.name || ''}
        />
      </div>
    </AdminLayout>
  );
}
