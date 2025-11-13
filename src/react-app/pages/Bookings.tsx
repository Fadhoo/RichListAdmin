/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import BookingEditModal from "@/react-app/components/BookingEditModal";
import DeleteConfirmModal from "@/react-app/components/DeleteConfirmModal";
import DataTable, { TableColumn } from "@/react-app/components/DataTable";
import { editBooking } from "../api/booking";
import { Calendar, MapPin, Users, DollarSign, Receipt, Edit, Trash2, TrendingUp, AlertCircle, Check, X } from "lucide-react";
import { useBooking } from "../hooks/useBooking";
import { Event } from "../types/events";
// import { Booking } from "../types/bookings";

interface BookingWithDetails {
  id: number;
  showId: Event;
  userId?: string;
  guestCount: number;
  totalAmount?: number;
  status: string;
  paymentId?: string;
  reference?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  eventTitle?: string;
  eventDate?: string;
  venueName?: string;
  bookingReference?: string;
}

// Define table columns
const getBookingColumns = (
  selectedBookings: Set<number>,
  selectAll: boolean,
  onBookingSelect: (id: number, checked: boolean) => void,
  onSelectAll: (checked: boolean) => void
): TableColumn<BookingWithDetails>[] => [
  {
    key: 'select',
    title: (
      <input
        type="checkbox"
        checked={selectAll}
        onChange={(e) => onSelectAll(e.target.checked)}
        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
      />
    ),
    width: '50px',
    render: (_, record) => (
      <input
        type="checkbox"
        checked={selectedBookings.has(record.id)}
        onChange={(e) => onBookingSelect(record.id, e.target.checked)}
        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        onClick={(e) => e.stopPropagation()}
      />
    ),
  },
  {
    key: 'bookingReference',
    title: 'Reference',
    sortable: true,
    render: (_, record) => (
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-900 font-mono">
          {record.bookingReference || `#${record.id}`}
        </div>
        <div className="text-xs text-gray-500">
          ID: {record.id}
        </div>
      </div>
    ),
  },
  {
    key: 'event_title',
    title: 'Event Details',
    sortable: true,
    render: (_, record) => (
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-900">
          {record.showId.name || 'Unknown Event'}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <MapPin className="w-3 h-3 mr-1" />
          {record.showId.venueId.name || 'Unknown Venue'}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(record.showId.date || 'Unknown').toLocaleDateString()}
        </div>
      </div>
    ),
  },
  {
    key: 'userId',
    title: 'Customer',
    render: (value) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">User ID</div>
        <div className="text-gray-500 font-mono text-xs">{value}</div>
      </div>
    ),
  },
  {
    key: 'quantity',
    title: 'Guests',
    sortable: true,
    render: (value) => (
      <div className="flex items-center">
        <Users className="w-4 h-4 text-gray-400 mr-2" />
        <span className="text-sm font-medium text-gray-900">{value} guest{value !== 1 ? 's' : ''}</span>
      </div>
    ),
  },
  {
    key: 'totalAmount',
    title: 'Amount',
    sortable: true,
    render: (value) => (
      <div className="flex items-center">
        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
        <span className="text-sm font-semibold text-gray-900">
          ₦{value ? value.toFixed(2) : '0.00'}
        </span>
      </div>
    ),
  },
  {
    key: 'status',
    title: 'Booking Status',
    sortable: true,
    render: (value) => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'confirmed':
            return 'bg-green-100 text-green-800 border-green-200';
          case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
          default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
        }
      };

      return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(value)}`}>
          {value}
        </span>
      );
    },
  },
  {
    key: 'paymentProviderId',
    title: 'Payment',
    sortable: true,
    render: (value) => {
      // const getPaymentStatusColor = (status: string) => {
      //   switch (status) {
      //     case 'completed':
      //       return 'bg-green-100 text-green-800 border-green-200';
      //     case 'pending':
      //       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      //     case 'failed':
      //       return 'bg-red-100 text-red-800 border-red-200';
      //     default:
      //       return 'bg-gray-100 text-gray-800 border-gray-200';
      //   }
      // };

      return (
        <span className={`flex items-center`}>
          {value}
        </span>
      );
    },
  },
  {
    key: 'createdAt',
    title: 'Booked',
    sortable: true,
    render: (value) => (
      <div className="text-sm text-gray-900">
        {new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
        <div className="text-xs text-gray-500">
          {new Date(value).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    ),
  },
];

export default function BookingsPage() {
  const bookingResult = useBooking({});
  const [tableState, tableActions] = Array.isArray(bookingResult) ? bookingResult : [ { bookings: [], loading: false, error: null, totalItems: 0, currentPage: 1, pageSize: 25, searchTerm: '', sortConfig: null, filters: {} }, { refresh: async () => {}, setPage: (page: number) => {}, setPageSize: (size: number) => {}, setSearchTerm: (term: string) => {}, setSortConfig: (config: any) => {} } ];  

  const [editModal, setEditModal] = useState<{ isOpen: boolean; booking: BookingWithDetails | null }>({
    isOpen: false,
    booking: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; booking: BookingWithDetails | null }>({
    isOpen: false,
    booking: null,
  });

  // Selection state for bulk operations
  const [selectedBookings, setSelectedBookings] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
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
        const data = await response.json();
        
        // Calculate booking statistics from current data
        const confirmedCount = tableState.bookings.filter((b: any) => b.booking_status === 'confirmed').length;
        const pendingCount = tableState.bookings.filter((b: any) => b.booking_status === 'pending').length;
        const cancelledCount = tableState.bookings.filter((b: any) => b.booking_status === 'cancelled').length;
        const pendingRevenue = tableState.bookings
          .filter((b: any) => b.payment_status === 'pending')
          .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

        setAnalytics({
          totalBookings: data.stats.bookings,
          confirmedBookings: confirmedCount,
          pendingBookings: pendingCount,
          cancelledBookings: cancelledCount,
          totalRevenue: data.stats.revenue,
          pendingRevenue,
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Recalculate analytics when table data changes
  useEffect(() => {
    if (tableState.bookings.length > 0) {
      const confirmedCount = tableState.bookings.filter((b: any) => b.booking_status === 'confirmed').length;
      const pendingCount = tableState.bookings.filter((b: any) => b.booking_status === 'pending').length;
      const cancelledCount = tableState.bookings.filter((b: any) => b.booking_status === 'cancelled').length;
      const pendingRevenue = tableState.bookings
        .filter((b: any) => b.payment_status === 'pending')
        .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

      setAnalytics(prev => ({
        ...prev,
        confirmedBookings: confirmedCount,
        pendingBookings: pendingCount,
        cancelledBookings: cancelledCount,
        pendingRevenue,
      }));
    }
  }, [tableState.bookings]);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedBookings(new Set());
    setSelectAll(false);
  }, [tableState.bookings]);

  // Handle individual booking selection
  const handleBookingSelect = (bookingId: number, checked: boolean) => {
    const newSelected = new Set(selectedBookings);
    if (checked) {
      newSelected.add(bookingId);
    } else {
      newSelected.delete(bookingId);
      setSelectAll(false);
    }
    setSelectedBookings(newSelected);
  };

  // Handle select all toggle
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = new Set(tableState.bookings.map((b: any) => b.id));
      setSelectedBookings(allIds);
    } else {
      setSelectedBookings(new Set());
    }
  };

  // Get selected bookings data
  const getSelectedBookingsData = () => {
    return tableState.bookings.filter((b: any) => selectedBookings.has(b.id));
  };

  // Get selected pending bookings
  const getSelectedPendingBookings = () => {
    return getSelectedBookingsData().filter((b: any) => b.booking_status === 'pending');
  };

  const handleUpdate = () => {
    tableActions.refresh(); // Refresh the table data
    setEditModal({ isOpen: false, booking: null });
    
    // Show success message
    const event = new CustomEvent('showNotification', {
      detail: { type: 'success', message: 'Booking updated successfully' }
    });
    window.dispatchEvent(event);
  };

  const handleDelete = async (booking: BookingWithDetails) => {
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        tableActions.refresh(); // Refresh the table data
        setDeleteModal({ isOpen: false, booking: null });
        
        // Show success message
        const event = new CustomEvent('showNotification', {
          detail: { type: 'success', message: 'Booking deleted successfully' }
        });
        window.dispatchEvent(event);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert('Failed to delete booking');
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    const selectedBookingsToUpdate = getSelectedBookingsData();
    
    if (selectedBookingsToUpdate.length === 0) {
      alert('Please select bookings to update');
      return;
    }

    // For confirming, only allow pending bookings
    let bookingsToUpdate = selectedBookingsToUpdate;
    if (status === 'confirmed') {
      bookingsToUpdate = selectedBookingsToUpdate.filter((b: any) => b.booking_status === 'pending');
      if (bookingsToUpdate.length === 0) {
        alert('No pending bookings selected');
        return;
      }
      if (bookingsToUpdate.length !== selectedBookingsToUpdate.length) {
        const pendingCount = bookingsToUpdate.length;
        const confirmed = confirm(`Only ${pendingCount} of the selected bookings are pending. Update these ${pendingCount} bookings to ${status}?`);
        if (!confirmed) return;
      }
    }

    const confirmed = confirm(`Update ${bookingsToUpdate.length} selected booking${bookingsToUpdate.length === 1 ? '' : 's'} to ${status}?`);
    if (!confirmed) return;

    try {
      const promises = bookingsToUpdate.map((booking: any) =>
        fetch(`/api/admin/bookings/${booking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ booking_status: status }),
        })
      );

      await Promise.all(promises);
      tableActions.refresh();
      setSelectedBookings(new Set()); // Clear selection after update
      setSelectAll(false);
      
      const event = new CustomEvent('showNotification', {
        detail: { type: 'success', message: `Updated ${bookingsToUpdate.length} booking${bookingsToUpdate.length === 1 ? '' : 's'} to ${status}` }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to bulk update bookings:', error);
      alert('Failed to update bookings');
    }
  };

  const handleBulkDelete = async () => {
    const selectedBookingsToDelete = getSelectedBookingsData();
    
    if (selectedBookingsToDelete.length === 0) {
      alert('Please select bookings to delete');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${selectedBookingsToDelete.length} selected booking${selectedBookingsToDelete.length === 1 ? '' : 's'}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const promises = selectedBookingsToDelete.map((booking: any) =>
        fetch(`/api/admin/bookings/${booking.id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      );

      await Promise.all(promises);
      tableActions.refresh();
      setSelectedBookings(new Set()); // Clear selection after delete
      setSelectAll(false);
      
      const event = new CustomEvent('showNotification', {
        detail: { type: 'success', message: `Deleted ${selectedBookingsToDelete.length} booking${selectedBookingsToDelete.length === 1 ? '' : 's'}` }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to bulk delete bookings:', error);
      alert('Failed to delete bookings');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 mt-2">Monitor and manage event bookings</p>
          </div>
          
          {/* Selection Info and Bulk Actions */}
          <div className="flex items-center space-x-3">
            {selectedBookings.size > 0 && (
              <div className="flex items-center space-x-3 bg-purple-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-purple-700 font-medium">
                  {selectedBookings.size} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkStatusUpdate('confirmed')}
                    disabled={getSelectedPendingBookings().length === 0}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    title={getSelectedPendingBookings().length === 0 ? "No pending bookings selected" : `Confirm ${getSelectedPendingBookings().length} pending booking(s)`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm ({getSelectedPendingBookings().length})</span>
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('cancelled')}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={tableActions.refresh}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                  ) : (
                    analytics.totalBookings.toLocaleString()
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
                  ) : (
                    analytics.confirmedBookings
                  )}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active bookings
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
                  ) : (
                    analytics.pendingBookings
                  )}
                </p>
                <p className="text-xs text-yellow-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Need attention
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                  ) : (
                    `₦${analytics.totalRevenue.toLocaleString()}`
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ₦{analytics.pendingRevenue.toLocaleString()} pending
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <DataTable
          data={tableState.bookings}
          columns={[
            ...getBookingColumns(selectedBookings, selectAll, handleBookingSelect, handleSelectAll),
            {
              key: 'actions',
              title: 'Actions',
              render: (_, record: BookingWithDetails) => (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditModal({ isOpen: true, booking: record });
                    }}
                    className="text-gray-400 hover:text-purple-600 transition-colors p-1 rounded hover:bg-purple-50"
                    title="Edit booking"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({ isOpen: true, booking: record });
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                    title="Delete booking"
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
          sortConfig={tableState.sortConfig}
          filters={tableState.filters}
          onPageChange={tableActions.setPage}
          onPageSizeChange={tableActions.setPageSize}
          onSearchChange={tableActions.setSearch ?? (() => {})}
          onSortChange={tableActions.setSort ?? (() => {})}
          onFilterChange={tableActions.setFilters ?? (() => {})}
          onRefresh={tableActions.refresh}
          onExport={tableActions.exportData}
          searchable={true}
          searchPlaceholder="Search bookings by reference, event, venue..."
          filterOptions={{
            status: [
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Pending', value: 'pending' },
              { label: 'Cancelled', value: 'cancelled' }
            ],
            paymentProviderId: [
              { label: 'Wallet', value: 'wallet' },
              { label: 'Paystack', value: 'paystack' },
              // { label: 'Failed', value: 'failed' }
            ]
          }}
          emptyState={{
            icon: Receipt,
            title: tableState.searchTerm || Object.values(tableState.filters).some(f => f && f !== 'all') ? 'No matching bookings' : 'No bookings yet',
            description: tableState.searchTerm || Object.values(tableState.filters).some(f => f && f !== 'all') 
              ? 'Try adjusting your search or filter criteria'
              : 'Bookings will appear here when users start booking events'
          }}
        />

        {/* Edit Booking Modal */}
        <BookingEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, booking: null })}
          booking={editModal.booking}
          onUpdate={handleUpdate}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, booking: null })}
          onConfirm={() => deleteModal.booking && handleDelete(deleteModal.booking)}
          title="Delete Booking"
          message="Are you sure you want to delete this booking? This action cannot be undone."
          itemName={deleteModal.booking?.reference || `Booking #${deleteModal.booking?.id}` || ''}
        />
      </div>
    </AdminLayout>
  );
}
