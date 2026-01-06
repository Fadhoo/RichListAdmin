import { useState, useEffect } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import DataTable, { TableColumn } from "@/react-app/components/DataTable";
import DeleteConfirmModal from "@/react-app/components/DeleteConfirmModal";
import StoryEditModal from "@/react-app/components/StoryEditModal";
import { fetchStoriesAPI, editStory, deleteStory } from "@/react-app/api/stories";
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Heart,
  Share,
  Play
} from "lucide-react";
import { Story } from "../types/stories";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [deletingStory, setDeletingStory] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [currentPage, pageSize, searchTerm, sortConfig, filters]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchTerm,
        filters: JSON.stringify(filters),
      });

      if (sortConfig) {
        params.append('sort_by', sortConfig.key);
        params.append('sort_order', sortConfig.direction);
      }

      const response = await fetchStoriesAPI(currentPage, pageSize, searchTerm, sortConfig ? `${sortConfig.key}:${sortConfig.direction}` : undefined);

      if (response.status === 200) {
        const data =  response.data;
        setStories(data.results || []);
        setTotalItems(data?.totalResults || 0);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = () => {
    setSelectedStory(null);
    setEditModalOpen(true);
  };

  const handleEditStory = (story: Story) => {
    setSelectedStory(story);
    setEditModalOpen(true);
  };

  const handleDeleteStory = (story: Story) => {
    setSelectedStory(story);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStory) return;

    setDeletingStory(true);
    try {
      const response = await deleteStory(selectedStory.id);

      if (response.status === 200) {
        await fetchStories();
        setDeleteModalOpen(false);
        setSelectedStory(null);
      }
    } catch (error) {
      console.error('Failed to delete story:', error);
    } finally {
      setDeletingStory(false);
    }
  };

  const handleStoryUpdated = () => {
    fetchStories();
    setEditModalOpen(false);
    setSelectedStory(null);
  };

  const togglePublishStatus = async (story: Story) => {
    try {
      const response = await editStory(story._id, { isActive: !story.isActive });

      if (response.status === 200) {
        await fetchStories();
      }
    } catch (error) {
      console.error('Failed to update story status:', error);
    }
  };

  const getStoryTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      general: 'General',
      venue_highlight: 'Venue Highlight',
      event_promo: 'Event Promo',
      behind_scenes: 'Behind Scenes',
      user_generated: 'User Generated',
    };
    return typeLabels[type] || type;
  };

  const getStoryTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      venue_highlight: 'bg-blue-100 text-blue-800',
      event_promo: 'bg-purple-100 text-purple-800',
      behind_scenes: 'bg-green-100 text-green-800',
      user_generated: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const columns: TableColumn<Story>[] = [
    {
      key: 'title',
      title: 'Story',
      sortable: true,
      render: (_, story) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {story.media ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-black">
                <video 
                  src={story.media} 
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {story.title}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStoryTypeBadgeColor(story.story_type)}`}>
                {getStoryTypeLabel(story.story_type)}
              </span>
              {story.is_featured && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'venue.name',
      title: 'Venue',
      sortable: false,
      render: (_, story) => (
        <div className="flex items-center space-x-2">
          {story.venueId ? (
            <>
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">{typeof story.venueId === 'string' ? story.venueId : story.venueId?.name}</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'event.title',
      title: 'Event',
      sortable: false,
      render: (_, story) => (
        <div className="flex items-center space-x-2">
          {story.showId ? (
            <>
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">{typeof story.showId === 'string' ? story.showId : story.showId?.name}</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'engagement',
      title: 'Engagement',
      sortable: false,
      render: (_, story) => (
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{story.view_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{story.like_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share className="w-4 h-4" />
            <span>{story.share_count}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'is_published',
      title: 'Status',
      sortable: true,
      render: (_, story) => (
        <button
          onClick={() => togglePublishStatus(story)}
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            story.is_published
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {story.is_published ? 'Published' : 'Draft'}
        </button>
      ),
    },
    {
      key: 'publish_date',
      title: 'Publish Date',
      sortable: true,
      render: (_, story) => (
        <div className="text-sm text-gray-600">
          {story.publishedAt 
            ? new Date(story.publishedAt).toLocaleDateString()
            : story.publishedAt 
              ? new Date(story.createdAt).toLocaleDateString()
              : '—'
          }
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, story) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditStory(story)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit story"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteStory(story)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete story"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = {
    story_type: [
      { label: 'General', value: 'general' },
      { label: 'Venue Highlight', value: 'venue_highlight' },
      { label: 'Event Promo', value: 'event_promo' },
      { label: 'Behind Scenes', value: 'behind_scenes' },
      { label: 'User Generated', value: 'user_generated' },
    ],
    is_published: [
      { label: 'Published', value: 'true' },
      { label: 'Draft', value: 'false' },
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stories</h1>
            <p className="text-gray-600 mt-2">Manage and create engaging stories for your platform</p>
          </div>
          <button
            onClick={handleCreateStory}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Story</span>
          </button>
        </div>

        {/* Stories Table */}
        <DataTable
          data={stories}
          columns={columns}
          loading={loading}
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          searchTerm={searchTerm}
          sortConfig={sortConfig}
          filters={filters}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onSearchChange={setSearchTerm}
          onSortChange={(key) => {
            setSortConfig(current => {
              if (current?.key === key) {
                return current.direction === 'asc' 
                  ? { key, direction: 'desc' }
                  : null;
              }
              return { key, direction: 'asc' };
            });
          }}
          onFilterChange={setFilters}
          onRefresh={fetchStories}
          searchPlaceholder="Search stories by title, content..."
          filterOptions={filterOptions}
          emptyState={{
            icon: BookOpen,
            title: "No stories found",
            description: "Get started by creating your first story to engage your audience.",
            action: (
              <button
                onClick={handleCreateStory}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Story</span>
              </button>
            ),
          }}
        />
      </div>

      {/* Modals */}
      <StoryEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedStory(null);
        }}
        story={selectedStory}
        onStoryUpdated={handleStoryUpdated}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedStory(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Story"
        message="Are you sure you want to delete this story? This action cannot be undone and all associated interactions will be lost."
        itemName={selectedStory?.title || ''}
        loading={deletingStory}
      />
    </AdminLayout>
  );
}
