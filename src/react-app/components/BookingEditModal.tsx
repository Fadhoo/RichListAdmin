/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle, Receipt, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Booking } from "../types/bookings";
import { editBooking } from "../api/booking";

interface BookingWithDetails extends Booking {
  // bookingReference: any;
  // paymentProviderId: any;
  // quantity: any;
  // id: string | undefined;
  userDetails: {};
  paymentDetails: {};
}

interface BookingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingWithDetails | null;
  onUpdate: () => void;
}

interface UpdateBookingData extends Booking {
  quantity?: number;
  paymentProviderId?: any;
  bookingReference?: any;
}

export default function BookingEditModal({
  isOpen,
  onClose,
  booking,
  onUpdate,
}: BookingEditModalProps) {
  const [formData, setFormData] = useState<UpdateBookingData>({
    quantity: 1,
    status: "",
    paymentProviderId: "",
    totalAmount: 0,
    showId: {} as any,
    guestCount: 0,
    createdAt: "",
    updatedAt: "",
    userId: "",
    bookingReference: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (booking) {
      const initialData: UpdateBookingData = {
        quantity: booking.quantity ?? undefined,
        status: booking.status,
        paymentProviderId: booking.paymentProviderId,
        totalAmount: booking.totalAmount || 0,
        showId: booking.showId,
        guestCount: booking.guestCount,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        userId: booking.userId,
        bookingReference: booking.bookingReference,
        id: booking.id,
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [booking]);

  // Track changes
  useEffect(() => {
    if (booking) {
      const hasChanged = 
        formData.quantity !== booking.quantity ||
        formData.status !== booking.status ||
        formData.paymentProviderId !== booking.paymentProviderId ||
        formData.totalAmount !== (booking.totalAmount || 0);
      
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
    if (!formData.quantity || formData.quantity < 1) {
      setErrors({ quantity: 'Guest count must be at least 1' });
      setLoading(false);
      return;
    }

    if (formData.totalAmount !== undefined && formData.totalAmount < 0) {
      setErrors({ totalAmount: 'Total amount cannot be negative' });
      setLoading(false);
      return;
    }

    try {
      const response = await editBooking(booking.id!, formData);

      if (response.status === 200) {
        onUpdate();
        onClose();
      } else {
        const error = await response.data;
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
                  {booking.bookingReference || `#${booking.id}`}
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
                <div className="font-medium">{booking.showId.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Venue:</span>
                <div className="font-medium">
                  {typeof booking.showId.venueId === 'object' && booking.showId.venueId !== null
                    ? booking.showId.venueId.name
                    : booking.showId.venueId}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Event Date:</span>
                <div className="font-medium">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Customer Username:</span>
                <div className="font-mono text-xs">{booking.userId}</div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-3">Current Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
                <span className={``}>
                  Payment: {booking.paymentProviderId}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Booked: {new Date(booking.createdAt).toLocaleDateString()}
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
                  value={formData.quantity || ''}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.quantity && (
                  <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.totalAmount || ''}
                  onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.totalAmount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.totalAmount && (
                  <p className="text-red-600 text-sm mt-1">{errors.totalAmount}</p>
                )}
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status
                </label>
                <select
                  value={formData.status || booking.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={formData.paymentProviderId || booking.paymentProviderId}
                  onChange={(e) => handleInputChange('paymentProviderId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div> */}
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
