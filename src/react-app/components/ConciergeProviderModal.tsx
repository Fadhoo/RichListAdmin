import { useState, useEffect } from "react";
import { X, Save, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import type { ConciergeProvider } from "@/react-app/types/conciergeProviders";
import type { Venue } from "@/react-app/types/venue";
import { fetchVenues } from "../api/venues";
import { createConciergeProvider, editConciergeProvider } from "../api/conciergeProviders";

interface ConciergeProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ConciergeProvider | null;
  onUpdate: () => void;
}

interface ProviderFormData {
  name: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  websiteUrl?: string;
  logoUrl?: string;
  businessLicense?: string;
  commissionRate?: number;
  paymentTerms?: string;
  specialties?: string;
  languages?: string;
  operatingHours?: string;
  venueId?: string;
}

export default function ConciergeProviderModal({
  isOpen,
  onClose,
  provider,
  onUpdate,
}: ConciergeProviderModalProps) {
  const [formData, setFormData] = useState<ProviderFormData>({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    websiteUrl: '',
    logoUrl: '',
    businessLicense: '',
    commissionRate: 10,
    paymentTerms: 'net_30',
    specialties: '',
    languages: '',
    operatingHours: '',
    venueId: undefined,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadVenues();
      if (provider) {
        setFormData({
          name: provider.name,
          description: provider.description || '',
          contactEmail: provider.contactEmail,
          contactPhone: provider.contactPhone || '',
          address: provider.metadata?.address || '',
          city: provider.metadata?.city || '',
          websiteUrl: provider.metadata?.websiteUrl || '',
          logoUrl: provider.metadata?.logoUrl || '',
          businessLicense: provider.metadata?.businessLicense || '',
          commissionRate: provider.metadata?.commissionRate || 10,
          paymentTerms: provider.metadata?.paymentTerms || 'net_30',
          specialties: provider.metadata?.specialties || '',
          languages: provider.metadata?.languages || '',
          operatingHours: provider.metadata?.operatingHours || '',
          venueId: provider.metadata?.venueId || undefined,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          contactEmail: '',
          contactPhone: '',
          address: '',
          city: '',
          websiteUrl: '',
          logoUrl: '',
          businessLicense: '',
          commissionRate: 10,
          paymentTerms: 'net_30',
          specialties: '',
          languages: '',
          operatingHours: '',
          venueId: undefined,
        });
      }
    }
  }, [isOpen, provider]);

  const loadVenues = async () => {
    try {
      const response = await fetchVenues(1, 100, '');
      setVenues(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch venues:', error);
      toast.error('Failed to load venues');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Transform formData to match API expectations
      const providerData = {
        ...(provider?.id && { id: provider.id }),
        name: formData.name,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        description: formData.description,
        metadata: {
          address: formData.address,
          city: formData.city,
          websiteUrl: formData.websiteUrl,
          logoUrl: formData.logoUrl,
          businessLicense: formData.businessLicense,
          commissionRate: formData.commissionRate,
          paymentTerms: formData.paymentTerms,
          specialties: formData.specialties,
          languages: formData.languages,
          operatingHours: formData.operatingHours,
          venueId: formData.venueId,
        },
      } as ConciergeProvider;

      if (provider) {
        await editConciergeProvider(provider.id, providerData);
        toast.success('Provider updated successfully');
      } else {
        await createConciergeProvider(providerData);
        toast.success('Provider created successfully');
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to save provider:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save provider';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const paymentTerms = [
    { value: 'immediate', label: 'Immediate Payment' },
    { value: 'net_15', label: 'Net 15 Days' },
    { value: 'net_30', label: 'Net 30 Days' },
    { value: 'net_60', label: 'Net 60 Days' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {provider ? 'Edit Service Provider' : 'Add Service Provider'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
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
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Luxury Concierge Services Ltd."
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="contact@luxuryconcierge.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+234 xxx xxx xxxx"
                  disabled={loading}
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
                  placeholder="Lagos"
                  disabled={loading}
                />
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
                placeholder="Brief description of your concierge services..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="123 Business District, Victoria Island"
                disabled={loading}
              />
            </div>
          </div>

          {/* Online Presence */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Online Presence</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://luxuryconcierge.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Business Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    commissionRate: parseFloat(e.target.value) || 0 
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="10.0"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  {paymentTerms.map(term => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business License
              </label>
              <input
                type="text"
                value={formData.businessLicense}
                onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Business registration/license number"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Venue
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
                <option value="">All Venues</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Operational Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Operational Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <textarea
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="VIP services, restaurant reservations, transportation, event planning..."
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Supported
                </label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="English, French, Yoruba, Igbo..."
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="24/7, Mon-Fri 9AM-6PM, etc."
                  disabled={loading}
                />
              </div>
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
                  <span>{provider ? 'Updating...' : 'Adding...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{provider ? 'Update Provider' : 'Add Provider'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
