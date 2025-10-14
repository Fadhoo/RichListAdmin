import { useState, useEffect } from "react";
import { X, Save, Receipt, AlertCircle } from "lucide-react";

interface BookingWithDetails {
  id: number;
  event_id: number;
  user_id: string;
  guest_count: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  booking_reference: string;
  special_requests: string;
  created_at: string;
  updated_at: string;
  event_title: string;
  event_date: string;
  venue_name: string;
}

interface BookingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingWithDetails | null;
  onUpdate: () => void;
}

interface UpdateBookingData {
  guest_count?: number;
  booking_status?: string;
  payment_status?: string;
  special_requests?: string;
  total_amount?: number;
}

export default function BookingEditModal({
  isOpen,
  onClose,
  booking,
  onUpdate,
}: BookingEditModalProps) {
  const [formData, setFormData] = useState<UpdateBookingData>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (booking) {
      const initialData = {
        guest_count: booking.guest_count,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        special_requests: booking.special_requests || '',
        total_amount: booking.total_amount || 0,
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [booking]);

  // Track changes
  useEffect(() => {
    if (booking) {
      const hasChanged = 
        formData.guest_count !== booking.guest_count ||
        formData.booking_status !== booking.booking_status ||
        formData.payment_status !== booking.payment_status ||
        formData.special_requests !== (booking.special_requests || '') ||
        formData.total_amount !== (booking.total_amount || 0);
      
      setHasChanges(hasChanged);
    }
  }, [formData, booking]);

  if (!isOpen || !booking) return null;

  const handleInputChange = (field: keyof UpdateBookingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    if (!formData.guest_count || formData.guest_count < 1) {
      setErrors({ guest_count: 'Guest count must be at least 1' });
      setLoading(false);
      return;
    }

    if (formData.total_amount !== undefined && formData.total_amount < 0) {
      setErrors({ total_amount: 'Total amount cannot be negative' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        const error = await response.json();
        setErrors({ general: error.error || 'Failed to update booking' });
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      setErrors({ general: 'Failed to update booking' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Booking</h2>
                <p className="text-sm text-gray-600">
                  {booking.booking_reference || `#${booking.id}`}
                </p>
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
          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Unsaved Changes Warning */}
          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">You have unsaved changes</span>
            </div>
          )}

          {/* Booking Overview */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-medium text-gray-900">Booking Overview</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Event:</span>
                <div className="font-medium">{booking.event_title}</div>
              </div>
              <div>
                <span className="text-gray-600">Venue:</span>
                <div className="font-medium">{booking.venue_name}</div>
              </div>
              <div>
                <span className="text-gray-600">Event Date:</span>
                <div className="font-medium">
                  {new Date(booking.event_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Customer ID:</span>
                <div className="font-mono text-xs">{booking.user_id}</div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-3">Current Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                  booking.booking_status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : booking.booking_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booking.booking_status}
                </span>
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                  booking.payment_status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : booking.payment_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  Payment: {booking.payment_status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Booked: {new Date(booking.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Count *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.guest_count || ''}
                  onChange={(e) => handleInputChange('guest_count', parseInt(e.target.value) || 1)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.guest_count ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.guest_count && (
                  <p className="text-red-600 text-sm mt-1">{errors.guest_count}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total_amount || ''}
                  onChange={(e) => handleInputChange('total_amount', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.total_amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.total_amount && (
                  <p className="text-red-600 text-sm mt-1">{errors.total_amount}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status
                </label>
                <select
                  value={formData.booking_status || booking.booking_status}
                  onChange={(e) => handleInputChange('booking_status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={formData.payment_status || booking.payment_status}
                  onChange={(e) => handleInputChange('payment_status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                value={formData.special_requests || ''}
                onChange={(e) => handleInputChange('special_requests', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Any special requests or notes..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer */}
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
              disabled={loading || !hasChanges}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
