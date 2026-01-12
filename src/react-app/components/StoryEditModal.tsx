/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { X, MapPin } from "lucide-react";
import { StoryWithDetails, CreateStory } from "@/react-app/types/stories";
import { Venue } from "@/react-app/types/venue";
// import { Event } from "@/react-app/types/events";
import { fetchVenues } from "../api/venues";
import { editStory, createStory, deleteStory } from "../api/stories";
// import { fetchEvents } from "../api/events";
import { useToast } from "@/react-app/contexts/ToastContext";
import VideoUpload from "./VideoUpload";

interface StoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryWithDetails | null;
  onStoryUpdated: () => void;
}

export default function StoryEditModal({ isOpen, onClose, story, onStoryUpdated }: StoryEditModalProps) {
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  // const [events, setEvents] = useState<Event[]>([]);
  const [venueSearchTerm, setVenueSearchTerm] = useState('');
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);
  const venueDropdownRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<Partial<CreateStory & { id?: number; is_published?: boolean; venue_id?: string; event_id?: string }>>({
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
      loadVenues();
      // loadEvents();
      
      if (story) {
        setFormData({
          id: story._id ? parseInt(story._id) : undefined,
          title: story.title,
          content: story.metadata?.content || '',
          story_type: story.metadata?.story_type || 'general',
          venue_id: typeof story.venueId === 'object' && story.venueId !== null
            ? (story.venueId as Venue).id?.toString()
            : (typeof story.venueId === 'string' ? story.venueId : undefined),
          // event_id: story.showId || undefined,
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

  // Close venue dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target as Node)) {
        setShowVenueDropdown(false);
      }
    };

    if (showVenueDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showVenueDropdown]);

  const loadVenues = async () => {
    try {
      const response = await fetchVenues(1, 10000, '', undefined);
      setVenues(response.data.results || []);
    } catch (error: any) {
      console.error('Failed to fetch venues:', error);
      showErrorToast(error.message || 'Failed to load venues');
    }
  };

  // const loadEvents = async () => {
  //   try {
  //     const response = await fetchEvents(1, 100, '', 'createdAt:desc');
  //     setEvents(response.results || []);
  //   } catch (error: any) {
  //     console.error('Failed to fetch events:', error);
  //     showErrorToast(error.message || 'Failed to load events');
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData: any = {
        title: formData.title || '',
        metadata: {
          content: formData.content || '',
          story_type: formData.story_type || 'general',
          is_featured: formData.is_featured || false,
          is_published: formData.is_published || false,
          expires_at: formData.expires_at || undefined,
        },
        media: formData.media_url || '',
        tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        publishedAt: formData.publish_date || undefined,
      };

      // Add optional venue and event IDs
      if (formData.venue_id) {
        submitData.venueId = formData.venue_id;
      }
      if (formData.event_id) {
        submitData.showId = formData.event_id;
      }

      if (story && story._id) {
        // Update existing story
        await editStory(story._id, submitData);
        showSuccessToast('Story updated successfully');
      } else {
        // Create new story
        await createStory(submitData);
        showSuccessToast('Story created successfully');
      }
      
      onStoryUpdated();
      onClose();
    } catch (error: any) {
      console.error('Failed to save story:', error);
      showErrorToast(error.message || 'Failed to save story');
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

  const handleDelete = async () => {
    if (!story || !story._id) return;
    
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteStory(story._id);
      showSuccessToast('Story deleted successfully');
      onStoryUpdated();
      onClose();
    } catch (error: any) {
      console.error('Failed to delete story:', error);
      showErrorToast(error.message || 'Failed to delete story');
    } finally {
      setDeleteLoading(false);
    }
  };

  const storyTypes = [
    { value: 'general', label: 'General' },
    { value: 'venue_highlight', label: 'Venue Highlight' },
    { value: 'event_promo', label: 'Event Promo' },
    { value: 'behind_scenes', label: 'Behind Scenes' },
    { value: 'user_generated', label: 'User Generated' },
  ];

  // Filter venues based on search term
  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(venueSearchTerm.toLowerCase())
  );

  // Get selected venue name
  const selectedVenue = venues.find(v => v.id === formData.venue_id);

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
                <div className="relative" ref={venueDropdownRef}>
                  <input
                    type="text"
                    value={selectedVenue ? selectedVenue.name : venueSearchTerm}
                    onChange={(e) => {
                      setVenueSearchTerm(e.target.value);
                      setShowVenueDropdown(true);
                      if (!e.target.value) {
                        handleInputChange('venue_id', undefined);
                      }
                    }}
                    onFocus={() => setShowVenueDropdown(true)}
                    placeholder="Search for a venue (optional)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {selectedVenue && (
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('venue_id', undefined);
                        setVenueSearchTerm('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {showVenueDropdown && !selectedVenue && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredVenues.length > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              handleInputChange('venue_id', undefined);
                              setVenueSearchTerm('');
                              setShowVenueDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-500 italic border-b"
                          >
                            No venue (optional)
                          </button>
                          {filteredVenues.map(venue => (
                            <button
                              key={venue.id}
                              type="button"
                              onClick={() => {
                                handleInputChange('venue_id', venue.id.toString());
                                setVenueSearchTerm('');
                                setShowVenueDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                            >
                              {venue.name}
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="px-3 py-2 text-gray-500 italic">
                          No venues found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* <div>
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
              </div> */}

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
              {/* <div className="space-y-4 border-t pt-6">
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
              </div> */}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {story && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading || loading}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Story</span>
                )}
              </button>
            )}
            <div className="flex space-x-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading || deleteLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || deleteLoading || !formData.title?.trim() || !formData.media_url?.trim()}
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
          </div>
        </form>
      </div>
    </div>
  );
}
