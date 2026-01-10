import { useState, useEffect } from "react";
import { X, Save, Settings } from "lucide-react";
import { toast } from "react-toastify";
import type { ConciergeService } from "@/react-app/types/conciergeServices";
import type { ConciergeProvider } from "@/react-app/types/conciergeProviders";
// import type { Venue } from "@/react-app/types/venue";
import { fetchConciergeProviders } from "../api/conciergeProviders";
// import { fetchVenues } from "../api/venues";
import { createConciergeService, editConciergeService } from "../api/conciergeServices";
import ImageUpload from "@/react-app/components/ImageUpload";

interface ConciergeServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ConciergeService | null;
  onUpdate: () => void;
}

interface ServiceFormData {
  name: string;
  description?: string;
  category?: string;
  price?: number;
  currency?: string;
  priceType?: string;
  durationMinutes?: number;
  conciergeId?: string;
  venueId?: string;
  requirements?: string;
  maxCapacity?: number;
  advanceBookingHours?: number;
  isActive?: boolean;
  imageId?: string;
}

export default function ConciergeServiceModal({
  isOpen,
  onClose,
  service,
  onUpdate,
  providerId,
}: ConciergeServiceModalProps & { providerId?: string }) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: '',
    price: undefined,
    currency: 'NGN',
    priceType: 'fixed',
    durationMinutes: undefined,
    conciergeId: providerId,
    venueId: undefined,
    requirements: '',
    maxCapacity: undefined,
    advanceBookingHours: 24,
    isActive: true,
    imageId: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [venues, setVenues] = useState<Venue[]>([]);
  const [providers, setProviders] = useState<ConciergeProvider[]>([]);

  useEffect(() => {
    if (isOpen) {
      // loadVenues();
      loadProviders();
      if (service) {
        setFormData({
          name: service.name,
          description: service.description || '',
          category: service.category || '',
          price: service.price || undefined,
          currency: service.currency || 'NGN',
          priceType: service.metadata?.priceType || 'fixed',
          durationMinutes: service.metadata?.durationMinutes || undefined,
          conciergeId: service.conciergeId || providerId,
          venueId: service.metadata?.venueId || undefined,
          requirements: service.metadata?.requirements || '',
          maxCapacity: service.metadata?.maxCapacity || undefined,
          advanceBookingHours: service.metadata?.advanceBookingHours || 24,
          isActive: service.isActive ?? true,
          imageId: service.imageId || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
          category: '',
          price: undefined,
          currency: 'NGN',
          priceType: 'fixed',
          durationMinutes: undefined,
          conciergeId: providerId,
          venueId: undefined,
          requirements: '',
          maxCapacity: undefined,
          advanceBookingHours: 24,
          isActive: true,
          imageId: '',
        });
      }
    }
  }, [isOpen, service, providerId]);

  // const loadVenues = async () => {
  //   try {
  //     const response = await fetchVenues(1, 100, '');
  //     setVenues(response.data.results || []);
  //   } catch (error) {
  //     console.error('Failed to fetch venues:', error);
  //     toast.error('Failed to load venues');
  //   }
  // };

  const loadProviders = async () => {
    try {
      const response = await fetchConciergeProviders(1, 100, '');
      setProviders(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      toast.error('Failed to load providers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Transform formData to match API expectations
      const serviceData: Omit<ConciergeService, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        currency: formData.currency,
        conciergeId: formData.conciergeId || '',
        isActive: formData.isActive,
        imageId: formData.imageId,
        metadata: {
          priceType: formData.priceType,
          durationMinutes: formData.durationMinutes,
          venueId: formData.venueId,
          requirements: formData.requirements,
          maxCapacity: formData.maxCapacity,
          advanceBookingHours: formData.advanceBookingHours,
        },
      };

      if (service) {
        await editConciergeService(service.id, serviceData);
        toast.success('Service updated successfully');
      } else {
        await createConciergeService(serviceData);
        toast.success('Service created successfully');
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to save service:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save service';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
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

  // const priceTypes = [
  //   { value: 'fixed', label: 'Fixed Price' },
  //   { value: 'hourly', label: 'Per Hour' },
  //   { value: 'per_person', label: 'Per Person' },
  //   { value: 'custom', label: 'Custom Pricing' },
  // ];

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
          {providerId && (
            <div className="mb-2 text-xs text-blue-600">Provider: {providers.find(p => p.id === providerId)?.name || providerId}</div>
          )}
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
                value={formData.conciergeId || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  conciergeId: e.target.value || undefined 
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

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Assignment
              </label>
              <select
                value={formData.venueId || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  venueId: e.target.value || undefined 
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
            </div> */}
          </div>

          {/* Pricing & Logistics */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Pricing & Logistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
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
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    price: e.target.value ? parseFloat(e.target.value) : undefined 
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
                  value={formData.durationMinutes || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    durationMinutes: e.target.value ? parseInt(e.target.value) : undefined 
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
                  value={formData.maxCapacity || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    maxCapacity: e.target.value ? parseInt(e.target.value) : undefined 
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
                value={formData.advanceBookingHours}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  advanceBookingHours: parseInt(e.target.value) || 0 
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
          </div> */}

          {/* Service Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Image
            </label>
            <ImageUpload
              onUpload={(url) => setFormData({ ...formData, imageId: url })}
              currentImage={formData.imageId}
              maxSizeMB={10}
            />
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                disabled={loading}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Available (Service is active and can be booked)
              </label>
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
