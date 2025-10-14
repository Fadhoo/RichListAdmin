import { useState, useEffect } from "react";
import { X, Save, User } from "lucide-react";
import type { ConciergeStaff, CreateConciergeStaff } from "@/shared/types";

interface ConciergeStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: ConciergeStaff | null;
  onUpdate: () => void;
}

export default function ConciergeStaffModal({
  isOpen,
  onClose,
  staff,
  onUpdate,
}: ConciergeStaffModalProps) {
  const [formData, setFormData] = useState<CreateConciergeStaff>({
    name: '',
    email: '',
    phone: '',
    position: 'concierge',
    specialties: '',
    hourly_rate: undefined,
    availability_schedule: '',
    provider_id: undefined,
    venue_id: undefined,
    profile_image: '',
    languages: '',
    experience_years: undefined,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [venues, setVenues] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchVenues();
      fetchProviders();
      if (staff) {
        setFormData({
          name: staff.name,
          email: staff.email,
          phone: staff.phone || '',
          position: staff.position,
          specialties: staff.specialties || '',
          hourly_rate: staff.hourly_rate || undefined,
          availability_schedule: staff.availability_schedule || '',
          provider_id: staff.provider_id || undefined,
          venue_id: staff.venue_id || undefined,
          profile_image: staff.profile_image || '',
          languages: staff.languages || '',
          experience_years: staff.experience_years || undefined,
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: 'concierge',
          specialties: '',
          hourly_rate: undefined,
          availability_schedule: '',
          provider_id: undefined,
          venue_id: undefined,
          profile_image: '',
          languages: '',
          experience_years: undefined,
        });
      }
    }
  }, [isOpen, staff]);

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
      const url = staff 
        ? `/api/admin/concierge/staff/${staff.id}`
        : '/api/admin/concierge/staff';
      
      const method = staff ? 'PUT' : 'POST';

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
        setErrors({ general: error.error || 'Failed to save staff member' });
      }
    } catch (error) {
      console.error('Failed to save staff member:', error);
      setErrors({ general: 'Failed to save staff member' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const positions = [
    'concierge',
    'senior_concierge',
    'vip_concierge',
    'event_coordinator',
    'guest_relations',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {staff ? 'Edit Staff Member' : 'Add Staff Member'}
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
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter full name"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="email@example.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+234 xxx xxx xxxx"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  {positions.map(position => (
                    <option key={position} value={position}>
                      {position.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                value={formData.profile_image}
                onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Professional Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.hourly_rate || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    hourly_rate: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="5000"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    experience_years: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="5"
                  disabled={loading}
                />
              </div>
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
                Assigned Venue
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
                <option value="">All Venues</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <textarea
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="VIP services, event coordination, restaurant reservations..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              <input
                type="text"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="English, French, Yoruba..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Schedule
              </label>
              <textarea
                value={formData.availability_schedule}
                onChange={(e) => setFormData({ ...formData, availability_schedule: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM..."
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
                  <span>{staff ? 'Updating...' : 'Adding...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{staff ? 'Update Staff' : 'Add Staff'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
