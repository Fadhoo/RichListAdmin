import { useState, useEffect } from "react";
import { X, Save, FileText, Star } from "lucide-react";
import type { ConciergeRequestWithDetails, UpdateConciergeRequest } from "@/shared/types";

interface ConciergeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ConciergeRequestWithDetails | null;
  onUpdate: () => void;
}

export default function ConciergeRequestModal({
  isOpen,
  onClose,
  request,
  onUpdate,
}: ConciergeRequestModalProps) {
  const [formData, setFormData] = useState<UpdateConciergeRequest>({
    concierge_id: undefined,
    status: undefined,
    priority: undefined,
    total_cost: undefined,
    payment_status: undefined,
    internal_notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchStaff();
      if (request) {
        setFormData({
          concierge_id: request.concierge_id || undefined,
          status: request.status as any,
          priority: request.priority as any,
          total_cost: request.total_cost || undefined,
          payment_status: request.payment_status as any,
          internal_notes: request.internal_notes || '',
        });
      }
    }
  }, [isOpen, request]);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/admin/concierge/staff?limit=100&filters={"is_active":"1"}', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStaff(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`/api/admin/concierge/requests/${request.id}`, {
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
        setErrors({ general: error.error || 'Failed to update request' });
      }
    } catch (error) {
      console.error('Failed to update request:', error);
      setErrors({ general: 'Failed to update request' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !request) return null;

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'assigned', label: 'Assigned', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Service Request Details</h2>
                <p className="text-sm text-gray-600">#{request.id} - {request.title}</p>
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

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Request Information</h3>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="font-medium">{request.request_type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Guest Count:</span>
                      <p className="font-medium">{request.guest_count}</p>
                    </div>
                  </div>
                  
                  {request.preferred_date && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Preferred Date:</span>
                        <p className="font-medium">{new Date(request.preferred_date).toLocaleDateString()}</p>
                      </div>
                      {request.preferred_time && (
                        <div>
                          <span className="text-sm text-gray-600">Preferred Time:</span>
                          <p className="font-medium">{request.preferred_time}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {request.budget_range && (
                    <div>
                      <span className="text-sm text-gray-600">Budget Range:</span>
                      <p className="font-medium">{request.budget_range}</p>
                    </div>
                  )}
                </div>
              </div>

              {request.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{request.description}</p>
                  </div>
                </div>
              )}

              {request.special_requirements && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Special Requirements</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{request.special_requirements}</p>
                  </div>
                </div>
              )}

              {/* Service & Venue Info */}
              {(request.service || request.venue || request.event) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Related Information</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {request.service && (
                      <div>
                        <span className="text-sm text-gray-600">Service:</span>
                        <p className="font-medium">{request.service.name}</p>
                      </div>
                    )}
                    {request.venue && (
                      <div>
                        <span className="text-sm text-gray-600">Venue:</span>
                        <p className="font-medium">{request.venue.name}</p>
                      </div>
                    )}
                    {request.event && (
                      <div>
                        <span className="text-sm text-gray-600">Event:</span>
                        <p className="font-medium">{request.event.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Feedback */}
              {request.customer_rating || request.customer_feedback ? (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Feedback</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {request.customer_rating && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < request.customer_rating!
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm font-medium">({request.customer_rating}/5)</span>
                        </div>
                      </div>
                    )}
                    {request.customer_feedback && (
                      <div>
                        <span className="text-sm text-gray-600">Feedback:</span>
                        <p className="text-sm text-gray-700 mt-1">{request.customer_feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Management Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.general}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Request Management</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned Concierge
                      </label>
                      <select
                        value={formData.concierge_id || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          concierge_id: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="">Unassigned</option>
                        {staff.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name} - {member.position}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status || ''}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={loading}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          value={formData.priority || ''}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={loading}
                        >
                          {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Cost (₦)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={formData.total_cost || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            total_cost: e.target.value ? parseFloat(e.target.value) : undefined 
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="50000"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Status
                        </label>
                        <select
                          value={formData.payment_status || ''}
                          onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={loading}
                        >
                          {paymentStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Internal Notes
                      </label>
                      <textarea
                        value={formData.internal_notes}
                        onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Add internal notes about this request..."
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Request Timeline */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Request Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{new Date(request.created_at).toLocaleString()}</span>
                    </div>
                    {request.assigned_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assigned:</span>
                        <span>{new Date(request.assigned_at).toLocaleString()}</span>
                      </div>
                    )}
                    {request.completed_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span>{new Date(request.completed_at).toLocaleString()}</span>
                      </div>
                    )}
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
                        <span>Update Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
