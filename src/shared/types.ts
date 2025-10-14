import z from "zod";

// Venue schemas
export const VenueSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  image_url: z.string().nullable(),
  capacity: z.number().nullable(),
  is_verified: z.boolean(),
  owner_id: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateVenueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  image_url: z.string().url().optional(),
  capacity: z.number().positive().optional(),
});

// Event schemas
export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  venue_id: z.number(),
  promoter_id: z.string().nullable(),
  event_date: z.string(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  base_price: z.number().nullable(),
  max_capacity: z.number().nullable(),
  image_url: z.string().nullable(),
  status: z.string(),
  is_house_party: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  venue_id: z.number(),
  event_date: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  base_price: z.number().positive().optional(),
  max_capacity: z.number().positive().optional(),
  image_url: z.string().url().optional(),
  is_house_party: z.boolean().default(false),
});

export const UpdateEventStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']),
});

// Booking schemas
export const BookingSchema = z.object({
  id: z.number(),
  event_id: z.number(),
  user_id: z.string(),
  guest_count: z.number(),
  total_amount: z.number().nullable(),
  booking_status: z.string(),
  payment_status: z.string(),
  booking_reference: z.string().nullable(),
  special_requests: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Admin user schemas
export const AdminUserSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  role: z.string(),
  permissions: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// User management schemas
export const UserSubscriptionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  plan_type: z.string(),
  status: z.string(),
  started_at: z.string(),
  expires_at: z.string().nullable(),
  billing_cycle: z.string().nullable(),
  price_paid: z.number().nullable(),
  payment_method: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const UserActivitySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  activity_type: z.string(),
  description: z.string().nullable(),
  metadata: z.string().nullable(),
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
  created_at: z.string(),
});

export const UpdateUserStatusSchema = z.object({
  is_active: z.boolean(),
});

export const UpdateUserSubscriptionSchema = z.object({
  plan_type: z.enum(['basic', 'gold', 'platinum']),
});

// Concierge schemas
export const ConciergeServiceProviderSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  contact_email: z.string(),
  contact_phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  website_url: z.string().nullable(),
  logo_url: z.string().nullable(),
  business_license: z.string().nullable(),
  is_verified: z.boolean(),
  is_active: z.boolean(),
  rating: z.number(),
  total_requests: z.number(),
  commission_rate: z.number(),
  payment_terms: z.string(),
  specialties: z.string().nullable(),
  languages: z.string().nullable(),
  operating_hours: z.string().nullable(),
  venue_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateConciergeServiceProviderSchema = z.object({
  name: z.string().min(1, "Provider name is required"),
  description: z.string().optional(),
  contact_email: z.string().email("Valid email is required"),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  website_url: z.string().url().optional(),
  logo_url: z.string().url().optional(),
  business_license: z.string().optional(),
  commission_rate: z.number().min(0).max(100).default(10),
  payment_terms: z.enum(['net_15', 'net_30', 'net_60', 'immediate']).default('net_30'),
  specialties: z.string().optional(),
  languages: z.string().optional(),
  operating_hours: z.string().optional(),
  venue_id: z.number().optional(),
});

export const ConciergeStaffSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  position: z.string(),
  specialties: z.string().nullable(),
  hourly_rate: z.number().nullable(),
  availability_schedule: z.string().nullable(),
  is_active: z.boolean(),
  provider_id: z.number().nullable(),
  venue_id: z.number().nullable(),
  profile_image: z.string().nullable(),
  languages: z.string().nullable(),
  experience_years: z.number().nullable(),
  rating: z.number(),
  total_requests: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateConciergeStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  position: z.string().default("concierge"),
  specialties: z.string().optional(),
  hourly_rate: z.number().positive().optional(),
  availability_schedule: z.string().optional(),
  provider_id: z.number().optional(),
  venue_id: z.number().optional(),
  profile_image: z.string().url().optional(),
  languages: z.string().optional(),
  experience_years: z.number().min(0).optional(),
});

export const ConciergeServiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  base_price: z.number().nullable(),
  price_type: z.string(),
  duration_minutes: z.number().nullable(),
  is_available: z.boolean(),
  provider_id: z.number().nullable(),
  venue_id: z.number().nullable(),
  requirements: z.string().nullable(),
  max_capacity: z.number().nullable(),
  advance_booking_hours: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateConciergeServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  base_price: z.number().nonnegative().optional(),
  price_type: z.enum(['fixed', 'hourly', 'per_person', 'custom']).default('fixed'),
  duration_minutes: z.number().positive().optional(),
  provider_id: z.number().optional(),
  venue_id: z.number().optional(),
  requirements: z.string().optional(),
  max_capacity: z.number().positive().optional(),
  advance_booking_hours: z.number().min(0).default(24),
});

export const ConciergeRequestSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  provider_id: z.number().nullable(),
  concierge_id: z.number().nullable(),
  service_id: z.number().nullable(),
  venue_id: z.number().nullable(),
  event_id: z.number().nullable(),
  request_type: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  preferred_date: z.string().nullable(),
  preferred_time: z.string().nullable(),
  guest_count: z.number(),
  budget_range: z.string().nullable(),
  special_requirements: z.string().nullable(),
  status: z.string(),
  priority: z.string(),
  assigned_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  total_cost: z.number().nullable(),
  payment_status: z.string(),
  customer_rating: z.number().nullable(),
  customer_feedback: z.string().nullable(),
  internal_notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateConciergeRequestSchema = z.object({
  provider_id: z.number().optional(),
  service_id: z.number().optional(),
  venue_id: z.number().optional(),
  event_id: z.number().optional(),
  request_type: z.string().min(1, "Request type is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  guest_count: z.number().positive().default(1),
  budget_range: z.string().optional(),
  special_requirements: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

export const UpdateConciergeRequestSchema = z.object({
  provider_id: z.number().optional(),
  concierge_id: z.number().optional(),
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  total_cost: z.number().nonnegative().optional(),
  payment_status: z.enum(['pending', 'paid', 'refunded']).optional(),
  internal_notes: z.string().optional(),
});

// Story schemas
export const StorySchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().nullable(),
  story_type: z.string(),
  venue_id: z.number().nullable(),
  event_id: z.number().nullable(),
  author_id: z.string().nullable(),
  media_url: z.string().nullable(),
  media_type: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  publish_date: z.string().nullable(),
  expires_at: z.string().nullable(),
  view_count: z.number(),
  like_count: z.number(),
  share_count: z.number(),
  tags: z.string().nullable(),
  metadata: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateStorySchema = z.object({
  title: z.string().min(1, "Story title is required"),
  content: z.string().optional(),
  story_type: z.enum(['general', 'venue_highlight', 'event_promo', 'behind_scenes', 'user_generated']).default('general'),
  venue_id: z.number().optional(),
  event_id: z.number().optional(),
  media_url: z.string().min(1, "Video is required"),
  media_type: z.literal('video').default('video'),
  is_featured: z.boolean().default(false),
  publish_date: z.string().optional(),
  expires_at: z.string().optional(),
  tags: z.string().optional(),
});

export const UpdateStorySchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  story_type: z.enum(['general', 'venue_highlight', 'event_promo', 'behind_scenes', 'user_generated']).optional(),
  venue_id: z.number().optional(),
  event_id: z.number().optional(),
  media_url: z.string().optional(),
  media_type: z.literal('video').optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  publish_date: z.string().optional(),
  expires_at: z.string().optional(),
  tags: z.string().optional(),
});

export const StoryInteractionSchema = z.object({
  id: z.number(),
  story_id: z.number(),
  user_id: z.string(),
  interaction_type: z.string(),
  metadata: z.string().nullable(),
  created_at: z.string(),
});

// Venue Product schemas
export const VenueProductSchema = z.object({
  id: z.number(),
  venue_id: z.number(),
  name: z.string(),
  category: z.string(),
  subcategory: z.string().nullable(),
  price: z.number().nullable(),
  currency: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  is_available: z.boolean(),
  is_featured: z.boolean(),
  minimum_order: z.number(),
  serving_size: z.string().nullable(),
  alcohol_content: z.number().nullable(),
  flavor_profile: z.string().nullable(),
  brand: z.string().nullable(),
  origin_country: z.string().nullable(),
  preparation_time_minutes: z.number().nullable(),
  ingredients: z.string().nullable(),
  dietary_restrictions: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateVenueProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  price: z.number().nonnegative().optional(),
  currency: z.string().default("NGN"),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  minimum_order: z.number().positive().default(1),
  serving_size: z.string().optional(),
  alcohol_content: z.number().min(0).max(100).optional(),
  flavor_profile: z.string().optional(),
  brand: z.string().optional(),
  origin_country: z.string().optional(),
  preparation_time_minutes: z.number().positive().optional(),
  ingredients: z.string().optional(),
  dietary_restrictions: z.string().optional(),
});

export const VenueProductCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  description: z.string().nullable(),
  icon_name: z.string().nullable(),
  color_code: z.string().nullable(),
  sort_order: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
});

// Wallet schemas
export const UserWalletSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  balance: z.number(),
  currency: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const WalletTransactionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  transaction_type: z.string(),
  amount: z.number(),
  balance_before: z.number(),
  balance_after: z.number(),
  currency: z.string(),
  reference_id: z.string().nullable(),
  reference_type: z.string().nullable(),
  description: z.string().nullable(),
  status: z.string(),
  processed_by: z.string().nullable(),
  metadata: z.string().nullable(),
  created_at: z.string(),
});

export const CreateWalletTransactionSchema = z.object({
  transaction_type: z.enum(['deposit', 'withdrawal', 'payment', 'refund', 'adjustment']),
  amount: z.number().positive(),
  reference_id: z.string().optional(),
  reference_type: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export const WalletAdjustmentSchema = z.object({
  amount: z.number(),
  transaction_type: z.enum(['deposit', 'withdrawal', 'adjustment']),
  description: z.string().min(1, "Description is required"),
});

// Derived types
export type Story = z.infer<typeof StorySchema>;
export type CreateStory = z.infer<typeof CreateStorySchema>;
export type UpdateStory = z.infer<typeof UpdateStorySchema>;
export type StoryInteraction = z.infer<typeof StoryInteractionSchema>;
export type Venue = z.infer<typeof VenueSchema>;
export type VenueProduct = z.infer<typeof VenueProductSchema>;
export type CreateVenueProduct = z.infer<typeof CreateVenueProductSchema>;
export type VenueProductCategory = z.infer<typeof VenueProductCategorySchema>;
export type CreateVenue = z.infer<typeof CreateVenueSchema>;
export type Event = z.infer<typeof EventSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type UpdateEventStatus = z.infer<typeof UpdateEventStatusSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;
export type UserActivity = z.infer<typeof UserActivitySchema>;
export type UpdateUserStatus = z.infer<typeof UpdateUserStatusSchema>;
export type UpdateUserSubscription = z.infer<typeof UpdateUserSubscriptionSchema>;
export type UserWallet = z.infer<typeof UserWalletSchema>;
export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;
export type CreateWalletTransaction = z.infer<typeof CreateWalletTransactionSchema>;
export type WalletAdjustment = z.infer<typeof WalletAdjustmentSchema>;
export type ConciergeServiceProvider = z.infer<typeof ConciergeServiceProviderSchema>;
export type CreateConciergeServiceProvider = z.infer<typeof CreateConciergeServiceProviderSchema>;
export type ConciergeStaff = z.infer<typeof ConciergeStaffSchema>;
export type CreateConciergeStaff = z.infer<typeof CreateConciergeStaffSchema>;
export type ConciergeService = z.infer<typeof ConciergeServiceSchema>;
export type CreateConciergeService = z.infer<typeof CreateConciergeServiceSchema>;
export type ConciergeRequest = z.infer<typeof ConciergeRequestSchema>;
export type CreateConciergeRequest = z.infer<typeof CreateConciergeRequestSchema>;
export type UpdateConciergeRequest = z.infer<typeof UpdateConciergeRequestSchema>;

// Extended types with joins
export type StoryWithDetails = Story & {
  venue?: Venue;
  event?: Event;
  author?: {
    id: string;
    email: string;
    name?: string;
  };
  interactions_summary?: {
    total_views: number;
    total_likes: number;
    total_shares: number;
    recent_interactions: StoryInteraction[];
  };
};

export type VenueWithProducts = Venue & {
  products: VenueProduct[];
  product_count: number;
  featured_products: VenueProduct[];
};

export type EventWithVenue = Event & {
  venue: Venue;
};

export type BookingWithDetails = Booking & {
  event: Event;
  venue: Venue;
};

export type ConciergeRequestWithDetails = ConciergeRequest & {
  provider?: ConciergeServiceProvider;
  concierge?: ConciergeStaff;
  service?: ConciergeService;
  venue?: Venue;
  event?: Event;
};

export type ConciergeStaffWithStats = ConciergeStaff & {
  provider?: ConciergeServiceProvider;
  stats: {
    active_requests: number;
    completed_requests: number;
    total_revenue: number;
    average_rating: number;
  };
};

export type ConciergeServiceProviderWithStats = ConciergeServiceProvider & {
  stats: {
    total_services: number;
    total_staff: number;
    active_requests: number;
    completed_requests: number;
    total_revenue: number;
    average_rating: number;
  };
};
