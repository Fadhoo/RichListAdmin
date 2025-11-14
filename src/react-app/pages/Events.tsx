import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import DeleteConfirmModal from "@/react-app/components/DeleteConfirmModal";
import EventEditModal from "@/react-app/components/EventEditModal";
import DataTable, { TableColumn } from "@/react-app/components/DataTable";
import { Plus, Calendar, MapPin, Clock, DollarSign, Users, CheckCircle, XCircle, AlertCircle, Trash2, Edit } from "lucide-react";
import type { Event, CreateEvent } from "../types/events";
import { Venue } from "../types/venue";
import ImageUpload from "@/react-app/components/ImageUpload";
import { useEvents } from "../hooks/useEvents";
// import { useVenues } from "../hooks/useVenues";
import { fetchVenues } from "../api/venues";
import { editEvent } from "../api/events";
interface EventWithVenue extends Event {
  venue_name: string;
  venue_address: string;
  venue_capacity?: number;
}

// Define table columns
const eventColumns: TableColumn<EventWithVenue>[] = [
  {
    key: 'title',
    title: 'Event',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-start space-x-4">
        {record.imageId ? (
          <img
            src={record.imageId}
            alt={record.name}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white opacity-50" />
          </div>
        )}
        {/* <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{record.name}</h3>
            {record.type === 'house party' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                House Party
              </span>
            )}
          </div>
          {record.desc && (
            <p className="text-xs text-gray-600 line-clamp-2">{record.desc}</p>
          )}
        </div> */}
      </div>
    ),
  },
  {
    key: 'event_date',
    title: 'Date & Time',
    sortable: true,
    render: (_, record) => (
      <div className="text-sm space-y-1">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(record.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{record.time || 'TBD'} - {'TBD'}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'venue_name',
    title: 'Venue',
    render: (_, record) => (
      <div className="flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-900">{record.venue_name}</span>
      </div>
    ),
  },
  {
    key: 'base_price',
    title: 'Price & Capacity',
    sortable: true,
    render: (_, record) => (
      <div className="text-sm space-y-1">
        {record.price && (
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span>₦{record.price.toLocaleString()}</span>
          </div>
        )}
        {record.venue_capacity && (
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{record.venue_capacity.toLocaleString()} max</span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'isActive',
    title: 'Active',
    sortable: true,
    render: (isActive) => (
      <span>
        {isActive ? 'Active' : 'Inactive'}<span>{isActive ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}</span>
      </span>
      // Additional styling can be added here
      
    ),
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    render: (status) => {
      const getStatusIcon = (statusValue: string) => {
        switch (statusValue) {
          case 'approved':
            return <CheckCircle className="w-4 h-4 text-green-500" />;
          case 'rejected':
            return <XCircle className="w-4 h-4 text-red-500" />;
          case 'cancelled':
            return <XCircle className="w-4 h-4 text-gray-500" />;
          default:
            return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        }
      };

      const getStatusColor = (statusValue: string) => {
        switch (statusValue) {
          case 'approved':
            return 'bg-green-100 text-green-800';
          case 'rejected':
            return 'bg-red-100 text-red-800';
          case 'cancelled':
            return 'bg-gray-100 text-gray-800';
          default:
            return 'bg-yellow-100 text-yellow-800';
        }
      };

      return (
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
      );
    },
  },
  {
    key: 'createdAt',
    title: 'Created',
    sortable: true,
    render: (createdAt) => new Date(createdAt).toLocaleDateString(),
  },
];

export default function EventsPage() {
  const eventResult = useEvents({});
  const [tableState, tableActions] = Array.isArray(eventResult) ? eventResult : [{ data: [], loading: true, totalItems: 0, currentPage: 1, pageSize: 10, searchTerm: '', sortConfig: {}, filters: {} }, { refresh: async () => {}} ];

  const [venues, setVenues] = useState<Venue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; event: EventWithVenue | null; loading: boolean }>({
    isOpen: false,
    event: null,
    loading: false,
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; event: EventWithVenue | null }>({
    isOpen: false,
    event: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateEvent>({
    name: '',
    desc: '',
    venueId: '',
    date: '',
    time: '',
    duration: '',
    price: undefined,
    // max_capacity: undefined,
    imageId: '',
    isFeatured: false,
    type: 'club',
  });

  useEffect(() => {
    fetchAllVenues();
  }, []);

  const fetchAllVenues = async () => {
    try {
      
      const response = await fetchVenues( 1, 1000, '', 'createdAt:desc' );

      if (response.status === 200) {
        const data = response.data;
        // Handle paginated response
        setVenues(data.results || data);
      } else {
        console.error('Failed to fetch venues:', response.status);
        alert('Failed to load venues. Please refresh the page.');
      }
    } catch (error) {
      console.error('Failed to fetch venues:', error);
      alert('Failed to load venues. Please check your connection.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    // Validate required fields
    if (!formData.name.trim()) {
      setErrors({ title: 'Event title is required' });
      setLoading(false);
      return;
    }
    
    if (!formData.venueId || formData.venueId === '') {
      setErrors({ venueId: 'Please select a venue' });
      setLoading(false);
      return;
    }
    
    if (!formData.date) {
      setErrors({ event_date: 'Event date is required' });
      setLoading(false);
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setErrors({ event_date: 'Event date cannot be in the past' });
      setLoading(false);
      return;
    }

    // Validate times if both are provided
    // if (formData.start_time && formData.start_time  {
    //   setErrors({ end_time: 'End time must be after start time' });
    //   setLoading(false);
    //   return;
    // }
    
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        tableActions.refresh(); // Refresh the table data
        setShowForm(false);
        setFormData({
          name: '',
          desc: '',
          venueId: '',
          date: '',
          time: '',
          duration: '',
          price: undefined,
          type: 'club',
          imageId: '',
          isFeatured: false,
        });
        setErrors({});
      } else {
        const error = await response.json();
        console.error('Server error:', error);
        setErrors({ general: error.error || 'Failed to create event' });
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      setErrors({ general: 'Failed to create event. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatus = async (eventId: string, status: string) => {
    try {
      setLoading(true);
      const response = await editEvent(eventId, { status });
      setLoading(false);

      if (response.status === 200) {
        tableActions.refresh(); // Refresh the table data
      } else {
        const error = await response.data.json();
        alert(error.error || 'Failed to update event status');
      }
    } catch (error) {
      console.error('Failed to update event status:', error);
      alert('Failed to update event status. Please try again.');
    }
  };

  const handleUpdate = () => {
    tableActions.refresh(); // Refresh the table data
    setEditModal({ isOpen: false, event: null });
  };

  

  const handleDelete = async () => {
    if (!deleteModal.event) return;
    
    setDeleteModal(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch(`/api/admin/events/${deleteModal.event.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        tableActions.refresh(); // Refresh the table data
        setDeleteModal({ isOpen: false, event: null, loading: false });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete event');
        setDeleteModal(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600 mt-2">Manage your nightlife events</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Add Event Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Event</h2>
            
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter event title"
                    disabled={loading}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <select
                    required
                    value={formData.venueId}
                    onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.venueId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <option value={''}>Select a venue</option>
                    {venues.map((venue) => (
                      console.log("Rendering venue option:", venue),
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </select>
                  {errors.venueId && <p className="text-red-600 text-sm mt-1">{errors.venueId}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.desc ?? ""}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the event..."
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.time || ''}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={new Date(formData.time).getTime() + duration || ''}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.end_time ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.end_time && <p className="text-red-600 text-sm mt-1">{errors.end_time}</p>}
                </div> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price/ Minimum order for clubs (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image
                </label>
                <ImageUpload
                  onUpload={(url) => setFormData({ ...formData, imageId: url })}
                  currentImage={formData.imageId || ''}
                  maxSizeMB={10}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="house_party"
                  checked={formData.type === 'house party'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.checked ? 'house party' : '' })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  disabled={loading}
                />
                <label htmlFor="house_party" className="ml-2 text-sm text-gray-700">
                  This is a house party (requires approval)
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events Table */}
        <DataTable
          data={eventResult[0]?.events.map(event => {
            const venue = venues.find(v => v.id === event.venueId);
            return {
              ...event,
              venue_name: venue ? venue.name : 'N/A',
              venue_address: venue ? venue.location : 'N/A',
              venue_capacity: venue ? venue.capacity : undefined,
            };
          })}
          columns={[
            ...eventColumns,
            {
              key: 'actions',
              title: 'Actions',
              render: (_, record: EventWithVenue) => (
                <div className="flex items-center space-x-2">
                  {record.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateEventStatus(record.id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateEventStatus(record.id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setEditModal({ isOpen: true, event: record })}
                    className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                    title="Edit event"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, event: record, loading: false })}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Delete event"
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
          onRefresh={tableActions.refresh ?? (() => {})}
          onExport={tableActions.exportData ?? (() => {})}
          searchable={true}
          searchPlaceholder="Search events by title, description, venue..."
          filterOptions={{
            status: [
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Cancelled', value: 'cancelled' }
            ],
            is_house_party: [
              { label: 'House Party', value: '1' },
              { label: 'Venue Event', value: '0' }
            ]
          }}
          emptyState={{
            icon: Calendar,
            title: tableState.searchTerm || Object.values(tableState.filters).some(f => f && f !== 'all') ? 'No matching events' : 'No events yet',
            description: tableState.searchTerm || Object.values(tableState.filters).some(f => f && f !== 'all') ? 'Try adjusting your search or filter criteria' : 'Get started by creating your first event',
            action: !tableState.searchTerm && !Object.values(tableState.filters).some(f => f && f !== 'all') ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Create Your First Event
              </button>
            ) : undefined
          }}
        />

        {/* Edit Event Modal */}
        <EventEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, event: null })}
          event={editModal.event}
          venues={venues}
          onUpdate={handleUpdate}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, event: null, loading: false })}
          onConfirm={handleDelete}
          title="Delete Event"
          message="Are you sure you want to delete this event? This action cannot be undone and will affect all associated bookings."
          itemName={deleteModal.event?.name || ''}
          loading={deleteModal.loading}
        />
      </div>
    </AdminLayout>
  );
}
