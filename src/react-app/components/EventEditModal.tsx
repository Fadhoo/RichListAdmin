import { useState, useEffect } from "react";
import { X, Save, Calendar } from "lucide-react";
import type { Event, CreateEvent } from "../types/events";
import { Venue } from "../types/venue";
import ImageUpload from "@/react-app/components/ImageUpload";
import { editEvent } from "../api/events";

interface EventWithVenue extends Event {
  venue_name: string;
  venue_address: string;
}

interface EventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventWithVenue | null;
  venues: Venue[];
  onUpdate: () => void;
}

export default function EventEditModal({
  isOpen,
  onClose,
  event,
  venues,
  onUpdate,
}: EventEditModalProps) {
  const [formData, setFormData] = useState<CreateEvent>({
    name: '',
    desc: '',
    venueId: '',
    date: '',
    time: '',
    duration: '',
    price: undefined,
    imageId: '',
    type: '',
    isFeatured: false,
    isActive: true,
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        desc: event.desc || '',
        venueId: event.venueId,
        date: event.date.split('T')[0], // Convert to YYYY-MM-DD format
        time: event.time || '',
        duration: event.duration || '',
        price: event.price || undefined,
        // capacity: event.venueId.capacity || undefined,
        imageId: event.imageId || '',
        type: event.type,
        isFeatured: event.isFeatured,
        isActive: event.isActive,
        status: event.status,
        // is_house_party: Boolean(event.type === 'house party'),
      });
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate required fields
    if (!formData.name.trim()) {
      setErrors({ name: 'Event name is required' });
      setLoading(false);
      return;
    }
    
    if (!formData.venueId || formData.venueId === '') {
      setErrors({ venueId: 'Please select a venue' });
      setLoading(false);
      return;
    }
    
    if (!formData.date) {
      setErrors({ date: 'Event date is required' });
      setLoading(false);
      return;
    }

    try {
      const response = await editEvent(event.id, formData);
      if (response.status === 200) {
        onUpdate();
        onClose();
      } else {
        const error = await response.data.json();
        setErrors({ general: error.error || 'Failed to update event' });
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      setErrors({ general: 'Failed to update event' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Event</h2>
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
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter event title"
                disabled={loading}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
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
                <option value={0}>Select a venue</option>
                {venues.map((venue) => (
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
              value={formData.desc}
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
                value={formData.time}
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
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price ($)
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    value="true"
                    checked={formData.isActive === true}
                    onChange={() => setFormData({ ...formData, isActive: true })}
                    className="form-radio text-purple-600"
                    disabled={loading}
                  />
                  <span className="ml-2">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    value="false"
                    checked={formData.isActive === false}
                    onChange={() => setFormData({ ...formData, isActive: false })}
                    className="form-radio text-purple-600"
                    disabled={loading}
                  />
                  <span className="ml-2">Inactive</span>
                </label>
              </div>
            </div>
              {/* <input
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Max attendees"
                disabled={loading}
              />
            </div> */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image
            </label>
            <ImageUpload
              onUpload={(url) => setFormData({ ...formData, imageId: url })}
              currentImage={formData.imageId || undefined}
              maxSizeMB={10}
            />
          </div>

          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="house_party"
              checked={formData.is_house_party}
              onChange={(e) => setFormData({ ...formData, is_house_party: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              disabled={loading}
            />
            <label htmlFor="house_party" className="ml-2 text-sm text-gray-700">
              This is a house party (requires approval)
            </label>
          </div> */}

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
                  <span>Update Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
