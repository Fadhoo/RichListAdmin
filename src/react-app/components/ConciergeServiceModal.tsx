import { useState, useEffect } from "react";
import { X, Save, Settings } from "lucide-react";
import type { ConciergeService, CreateConciergeService } from "@/shared/types";

interface ConciergeServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ConciergeService | null;
  onUpdate: () => void;
}

export default function ConciergeServiceModal({
  isOpen,
  onClose,
  service,
  onUpdate,
}: ConciergeServiceModalProps) {
  const [formData, setFormData] = useState<CreateConciergeService>({
    name: '',
    description: '',
    category: '',
    base_price: undefined,
    price_type: 'fixed',
    duration_minutes: undefined,
    provider_id: undefined,
    venue_id: undefined,
    requirements: '',
    max_capacity: undefined,
    advance_booking_hours: 24,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [venues, setVenues] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchVenues();
      fetchProviders();
      if (service) {
        setFormData({
          name: service.name,
          description: service.description || '',
          category: service.category,
          base_price: service.base_price || undefined,
          price_type: service.price_type as any,
          duration_minutes: service.duration_minutes || undefined,
          provider_id: service.provider_id || undefined,
          venue_id: service.venue_id || undefined,
          requirements: service.requirements || '',
          max_capacity: service.max_capacity || undefined,
          advance_booking_hours: service.advance_booking_hours,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          category: '',
          base_price: undefined,
          price_type: 'fixed',
          duration_minutes: undefined,
          provider_id: undefined,
          venue_id: undefined,
          requirements: '',
          max_capacity: undefined,
          advance_booking_hours: 24,
        });
      }
    }
  }, [isOpen, service]);

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/admin/venues?limit=100', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setVenues(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/concierge/providers?limit=100', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProviders(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const url = service 
        ? `/api/admin/concierge/services/${service.id}`
        : '/api/admin/concierge/services';
      
      const method = service ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
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
        setErrors({ general: error.error || 'Failed to save service' });
      }
    } catch (error) {
      console.error('Failed to save service:', error);
      setErrors({ general: 'Failed to save service' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { value: 'vip', label: 'VIP Services' },
    { value: 'transport', label: 'Transportation' },
    { value: 'dining', label: 'Dining & Reservations' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'events', label: 'Event Planning' },
    { value: 'other', label: 'Other Services' },
  ];

  const priceTypes = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Per Hour' },
    { value: 'per_person', label: 'Per Person' },
    { value: 'custom', label: 'Custom Pricing' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {service ? 'Edit Service' : 'Add Service'}
              </h2>
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
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Service Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="VIP Table Reservation"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Detailed description of the service..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Provider *
              </label>
              <select
                required
                value={formData.provider_id || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  provider_id: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select Provider</option>
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Assignment
              </label>
              <select
                value={formData.venue_id || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  venue_id: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Available at all venues</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Logistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Pricing & Logistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  value={formData.price_type}
                  onChange={(e) => setFormData({ ...formData, price_type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  {priceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.base_price || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    base_price: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="50000"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration_minutes || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    duration_minutes: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="120"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_capacity || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    max_capacity: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="8"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Booking Required (Hours)
              </label>
              <input
                type="number"
                min="0"
                value={formData.advance_booking_hours}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  advance_booking_hours: parseInt(e.target.value) || 0 
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="24"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Valid ID required, dress code: smart casual..."
                disabled={loading}
              />
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
                  <span>{service ? 'Updating...' : 'Adding...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{service ? 'Update Service' : 'Add Service'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
