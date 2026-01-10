import { useState, useEffect } from "react";
import { X, Calendar, MapPin } from "lucide-react";
import { StoryWithDetails, CreateStory } from "@/react-app/types/stories";
import { Venue } from "@/react-app/types/venue";
import { Event } from "@/react-app/types/events";
import VideoUpload from "./VideoUpload";

interface StoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryWithDetails | null;
  onStoryUpdated: () => void;
}

export default function StoryEditModal({ isOpen, onClose, story, onStoryUpdated }: StoryEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  const [formData, setFormData] = useState<Partial<CreateStory & { id?: number; is_published?: boolean }>>({
    title: '',
    content: '',
    story_type: 'general',
    venue_id: undefined,
    event_id: undefined,
    media_url: '',
    media_type: 'video',
    is_featured: false,
    is_published: false,
    publish_date: '',
    expires_at: '',
    tags: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchVenues();
      fetchEvents();
      
      if (story) {
        setFormData({
          id: story._id ? parseInt(story._id) : undefined,
          title: story.title,
          content: story.metadata?.content || '',
          story_type: story.metadata?.story_type || 'general',
          venue_id: typeof story.venueId === 'string' ? parseInt(story.venueId) : undefined,
          event_id: typeof story.showId === 'string' ? parseInt(story.showId) : undefined,
          media_url: story.media || '',
          media_type: 'video',
          is_featured: story.metadata?.is_featured || false,
          is_published: story.metadata?.is_published || false,
          publish_date: story.publishedAt ? story.publishedAt.split('T')[0] : '',
          expires_at: story.metadata?.expires_at ? story.metadata.expires_at.split('T')[0] : '',
          tags: story.tags?.join(', ') || '',
        });
      } else {
        setFormData({
          title: '',
          content: '',
          story_type: 'general',
          venue_id: undefined,
          event_id: undefined,
          media_url: '',
          media_type: 'video',
          is_featured: false,
          is_published: false,
          publish_date: '',
          expires_at: '',
          tags: '',
        });
      }
    }
  }, [isOpen, story]);

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

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events?limit=100', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = story 
        ? `/api/admin/stories/${story.id}`
        : '/api/admin/stories';
      
      const method = story ? 'PUT' : 'POST';
      
      const submitData = { ...formData };
      delete submitData.id;

      // Convert empty strings to null for optional fields
      if (!submitData.venue_id) submitData.venue_id = undefined;
      if (!submitData.event_id) submitData.event_id = undefined;
      if (!submitData.media_url) submitData.media_url = undefined;
      if (!submitData.publish_date) submitData.publish_date = undefined;
      if (!submitData.expires_at) submitData.expires_at = undefined;
      if (!submitData.tags) submitData.tags = undefined;
      
      // Set media_type to video
      submitData.media_type = 'video';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });

      if (response.ok) {
        onStoryUpdated();
      } else {
        const errorData = await response.json();
        console.error('Failed to save story:', errorData);
      }
    } catch (error) {
      console.error('Failed to save story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const storyTypes = [
    { value: 'general', label: 'General' },
    { value: 'venue_highlight', label: 'Venue Highlight' },
    { value: 'event_promo', label: 'Event Promo' },
    { value: 'behind_scenes', label: 'Behind Scenes' },
    { value: 'user_generated', label: 'User Generated' },
  ];

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {story ? 'Edit Story' : 'Create New Story'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter story title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Type
                </label>
                <select
                  value={formData.story_type}
                  onChange={(e) => handleInputChange('story_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {storyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={6}
                  placeholder="Write your story content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Associations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Associated Venue
                </label>
                <select
                  value={formData.venue_id || ''}
                  onChange={(e) => handleInputChange('venue_id', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a venue (optional)</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Associated Event
                </label>
                <select
                  value={formData.event_id || ''}
                  onChange={(e) => handleInputChange('event_id', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select an event (optional)</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video *
                </label>
                <VideoUpload
                  value={formData.media_url}
                  onChange={(url) => handleInputChange('media_url', url)}
                />
                <p className="text-xs text-gray-500 mt-1">Upload your video file (MP4, MOV, AVI, WebM supported)</p>
              </div>

              {/* Publishing Settings */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Story</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => handleInputChange('is_published', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Publish Now</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publish_date}
                      onChange={(e) => handleInputChange('publish_date', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expires On
                    </label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => handleInputChange('expires_at', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title?.trim() || !formData.media_url?.trim()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{story ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{story ? 'Update Story' : 'Create Story'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
