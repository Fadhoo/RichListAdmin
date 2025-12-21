// import { Hono } from "hono";
// import { cors } from "hono/cors";
// import {
//   exchangeCodeForSessionToken,
//   getOAuthRedirectUrl,
//   authMiddleware,
//   deleteSession,
//   MOCHA_SESSION_TOKEN_COOKIE_NAME,
// } from "@getmocha/users-service/backend";
// import { getCookie, setCookie } from "hono/cookie";
// import { zValidator } from "@hono/zod-validator";
// import { 
//   CreateVenueSchema, 
//   CreateEventSchema, 
//   UpdateEventStatusSchema, 
//   UpdateUserStatusSchema,
//   CreateConciergeStaffSchema,
//   CreateConciergeServiceSchema,
//   CreateConciergeRequestSchema,
//   UpdateConciergeRequestSchema,
//   CreateStorySchema,
//   UpdateStorySchema,
//   WalletAdjustmentSchema
// } from "@/shared/types";
// import { z } from "zod";

// const app = new Hono<{ Bindings: Env }>();

// // Pagination and filtering schema
// const PaginationSchema = z.object({
//   page: z.string().optional().default('1'),
//   limit: z.string().optional().default('25'),
//   search: z.string().optional().default(''),
//   sort_by: z.string().optional(),
//   sort_order: z.enum(['asc', 'desc']).optional().default('asc'),
//   filters: z.string().optional().default('{}'),
// });

// // CORS middleware
// app.use('*', cors({
//   origin: ['http://localhost:5173', 'https://localhost:5173'],
//   credentials: true,
// }));

// // Auth routes
// app.get('/api/oauth/google/redirect_url', async (c) => {
//   const redirectUrl = await getOAuthRedirectUrl('google', {
//     apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
//     apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
//   });

//   return c.json({ redirectUrl }, 200);
// });

// app.post("/api/sessions", async (c) => {
//   const body = await c.req.json();

//   if (!body.code) {
//     return c.json({ error: "No authorization code provided" }, 400);
//   }

//   const sessionToken = await exchangeCodeForSessionToken(body.code, {
//     apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
//     apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
//   });

//   setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
//     httpOnly: true,
//     path: "/",
//     sameSite: "none",
//     secure: true,
//     maxAge: 60 * 24 * 60 * 60, // 60 days
//   });

//   return c.json({ success: true }, 200);
// });

// app.get("/api/users/me", authMiddleware, async (c) => {
//   return c.json(c.get("user"));
// });

// app.get('/api/logout', async (c) => {
//   const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

//   if (typeof sessionToken === 'string') {
//     await deleteSession(sessionToken, {
//       apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
//       apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
//     });
//   }

//   setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
//     httpOnly: true,
//     path: '/',
//     sameSite: 'none',
//     secure: true,
//     maxAge: 0,
//   });

//   return c.json({ success: true }, 200);
// });

// // Admin middleware - check if user is admin
// const adminMiddleware = async (c: any, next: any) => {
//   const user = c.get('user');
//   if (!user) {
//     return c.json({ error: 'Unauthorized' }, 401);
//   }

//   let { results } = await c.env.DB.prepare(
//     "SELECT * FROM admin_users WHERE user_id = ?"
//   ).bind(user.id).all();

//   // Auto-create admin user for the first login (you can modify this logic as needed)
//   if (results.length === 0) {
//     // For now, we'll auto-approve any Google user as admin (you can change this)
//     await c.env.DB.prepare(`
//       INSERT INTO admin_users (user_id, role, permissions)
//       VALUES (?, 'admin', 'full_access')
//     `).bind(user.id).run();

//     const { results: newResults } = await c.env.DB.prepare(
//       "SELECT * FROM admin_users WHERE user_id = ?"
//     ).bind(user.id).all();

//     results = newResults;
//   }

//   c.set('adminUser', results[0]);
//   await next();
// };

// // Helper function to build WHERE clause for search and filters
// function buildWhereClause(searchFields: string[], search: string, filters: Record<string, string>) {
//   const conditions: string[] = [];
//   const bindings: any[] = [];

//   // Add search conditions
//   if (search && searchFields.length > 0) {
//     const searchConditions = searchFields.map(field => `${field} LIKE ?`);
//     conditions.push(`(${searchConditions.join(' OR ')})`);
//     searchFields.forEach(() => bindings.push(`%${search}%`));
//   }

//   // Add filter conditions
//   Object.entries(filters).forEach(([key, value]) => {
//     if (value && value !== 'all') {
//       conditions.push(`${key} = ?`);
//       bindings.push(value);
//     }
//   });

//   const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
//   return { whereClause, bindings };
// }

// // Venues API with pagination
// app.get('/api/admin/venues', authMiddleware, adminMiddleware, zValidator('query', PaginationSchema), async (c) => {
//   const { page, limit, search, sort_by, sort_order, filters } = c.req.valid('query');
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   const parsedFilters = JSON.parse(filters);

//   // Build search and filter conditions
//   const searchFields = ['name', 'city', 'address', 'email'];
//   const { whereClause, bindings } = buildWhereClause(searchFields, search, parsedFilters);

//   // Build ORDER BY clause
//   let orderClause = 'ORDER BY created_at DESC';
//   if (sort_by) {
//     const validSortFields = ['name', 'city', 'capacity', 'created_at', 'is_verified'];
//     if (validSortFields.includes(sort_by)) {
//       orderClause = `ORDER BY ${sort_by} ${sort_order.toUpperCase()}`;
//     }
//   }

//   // Get total count
//   const countQuery = `SELECT COUNT(*) as total FROM venues ${whereClause}`;
//   const { total } = await c.env.DB.prepare(countQuery).bind(...bindings).first() as any;

//   // Get paginated data
//   const dataQuery = `SELECT * FROM venues ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
//   const { results } = await c.env.DB.prepare(dataQuery).bind(...bindings, limitNum, offset).all();

//   return c.json({
//     data: results,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limitNum)
//     }
//   });
// });

// // Bookings CRUD operations
// app.get('/api/admin/bookings/:id', authMiddleware, adminMiddleware, async (c) => {
//   const bookingId = c.req.param('id');

//   const { results } = await c.env.DB.prepare(`
//     SELECT b.*, e.title as event_title, e.event_date, v.name as venue_name
//     FROM bookings b
//     JOIN events e ON b.event_id = e.id
//     JOIN venues v ON e.venue_id = v.id
//     WHERE b.id = ?
//   `).bind(bookingId).all();

//   if (results.length === 0) {
//     return c.json({ error: 'Booking not found' }, 404);
//   }

//   return c.json(results[0]);
// });

// const UpdateBookingSchema = z.object({
//   guest_count: z.number().positive().optional(),
//   booking_status: z.enum(['confirmed', 'pending', 'cancelled']).optional(),
//   payment_status: z.enum(['completed', 'pending', 'failed']).optional(),
//   special_requests: z.string().optional(),
//   total_amount: z.number().nonnegative().optional(),
// });

// app.put('/api/admin/bookings/:id', authMiddleware, adminMiddleware, zValidator('json', UpdateBookingSchema), async (c) => {
//   const bookingId = c.req.param('id');
//   const data = c.req.valid('json');

//   const { success } = await c.env.DB.prepare(`
//     UPDATE bookings SET 
//       guest_count = COALESCE(?, guest_count),
//       booking_status = COALESCE(?, booking_status),
//       payment_status = COALESCE(?, payment_status),
//       special_requests = COALESCE(?, special_requests),
//       total_amount = COALESCE(?, total_amount),
//       updated_at = CURRENT_TIMESTAMP
//     WHERE id = ?
//   `).bind(
//     data.guest_count || null,
//     data.booking_status || null,
//     data.payment_status || null,
//     data.special_requests || null,
//     data.total_amount || null,
//     bookingId
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update booking' }, 500);
//   }

//   const { results } = await c.env.DB.prepare(`
//     SELECT b.*, e.title as event_title, e.event_date, v.name as venue_name
//     FROM bookings b
//     JOIN events e ON b.event_id = e.id
//     JOIN venues v ON e.venue_id = v.id
//     WHERE b.id = ?
//   `).bind(bookingId).all();

//   return c.json(results[0]);
// });

// app.delete('/api/admin/bookings/:id', authMiddleware, adminMiddleware, async (c) => {
//   const bookingId = c.req.param('id');

//   const { success } = await c.env.DB.prepare(
//     "DELETE FROM bookings WHERE id = ?"
//   ).bind(bookingId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete booking' }, 500);
//   }

//   return c.json({ success: true });
// });

// // Users CRUD operations
// app.get('/api/admin/users/:id', authMiddleware, adminMiddleware, async (c) => {
//   const userId = c.req.param('id');

//   const { results: users } = await c.env.DB.prepare(
//     "SELECT id, email, google_user_data, created_at, last_login, is_active FROM users WHERE id = ?"
//   ).bind(userId).all();

//   if (users.length === 0) {
//     return c.json({ error: 'User not found' }, 404);
//   }

//   const user = users[0] as any;

//   // Get user subscription
//   const { results: subscriptions } = await c.env.DB.prepare(
//     "SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'"
//   ).bind(userId).all();

//   // Get or create user wallet
//   let { results: wallets } = await c.env.DB.prepare(
//     "SELECT * FROM user_wallets WHERE user_id = ?"
//   ).bind(userId).all();

//   if (wallets.length === 0) {
//     // Create wallet for user if it doesn't exist
//     await c.env.DB.prepare(
//       "INSERT INTO user_wallets (user_id, balance, currency) VALUES (?, 0.00, 'NGN')"
//     ).bind(userId).run();
    
//     const { results: newWallets } = await c.env.DB.prepare(
//       "SELECT * FROM user_wallets WHERE user_id = ?"
//     ).bind(userId).all();
//     wallets = newWallets;
//   }

//   // Get user stats
//   const [bookingStats, totalSpent, eventsCreated] = await Promise.all([
//     c.env.DB.prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?").bind(userId).first(),
//     c.env.DB.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE user_id = ? AND payment_status = 'completed'").bind(userId).first(),
//     c.env.DB.prepare("SELECT COUNT(*) as count FROM events WHERE promoter_id = ?").bind(userId).first(),
//   ]);

//   // Get recent activity
//   const { results: activities } = await c.env.DB.prepare(
//     "SELECT * FROM user_activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 10"
//   ).bind(userId).all();

//   return c.json({
//     ...user,
//     google_user_data: user.google_user_data ? JSON.parse(user.google_user_data) : {},
//     subscription: subscriptions[0] || null,
//     wallet: wallets[0] || null,
//     stats: {
//       total_bookings: (bookingStats as any)?.count || 0,
//       total_spent: (totalSpent as any)?.total || 0,
//       events_created: (eventsCreated as any)?.count || 0,
//     },
//     recent_activity: activities,
//   });
// });

// const UpdateUserSchema = z.object({
//   email: z.string().email().optional(),
//   is_active: z.boolean().optional(),
// });

// app.put('/api/admin/users/:id', authMiddleware, adminMiddleware, zValidator('json', UpdateUserSchema), async (c) => {
//   const userId = c.req.param('id');
//   const data = c.req.valid('json');
//   const currentUser = c.get('user');

//   const updateFields = [];
//   const bindings = [];

//   if (data.email) {
//     updateFields.push('email = ?');
//     bindings.push(data.email);
//   }

//   if (data.is_active !== undefined) {
//     updateFields.push('is_active = ?');
//     bindings.push(data.is_active);
//   }

//   if (updateFields.length === 0) {
//     return c.json({ error: 'No fields to update' }, 400);
//   }

//   updateFields.push('updated_at = CURRENT_TIMESTAMP');
//   bindings.push(userId);

//   const { success } = await c.env.DB.prepare(`
//     UPDATE users SET ${updateFields.join(', ')} WHERE id = ?
//   `).bind(...bindings).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update user' }, 500);
//   }

//   // Log the activity
//   await c.env.DB.prepare(
//     "INSERT INTO user_activities (user_id, activity_type, description) VALUES (?, 'profile_update', ?)"
//   ).bind(
//     userId, 
//     `Profile updated by admin ${currentUser?.email}`
//   ).run();

//   const { results } = await c.env.DB.prepare(
//     "SELECT id, email, google_user_data, created_at, last_login, is_active FROM users WHERE id = ?"
//   ).bind(userId).all();

//   return c.json({
//     ...results[0],
//     google_user_data: (results[0] as any).google_user_data ? JSON.parse((results[0] as any).google_user_data) : {},
//   });
// });

// app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, async (c) => {
//   const userId = c.req.param('id');
//   const currentUser = c.get('user');

//   // Check if user has bookings or events
//   const [bookingCount, eventCount] = await Promise.all([
//     c.env.DB.prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?").bind(userId).first(),
//     c.env.DB.prepare("SELECT COUNT(*) as count FROM events WHERE promoter_id = ?").bind(userId).first(),
//   ]);

//   if ((bookingCount as any)?.count > 0 || (eventCount as any)?.count > 0) {
//     return c.json({ error: 'Cannot delete user with associated bookings or events. Consider deactivating instead.' }, 400);
//   }

//   // Delete related data first
//   await Promise.all([
//     c.env.DB.prepare("DELETE FROM user_subscriptions WHERE user_id = ?").bind(userId).run(),
//     c.env.DB.prepare("DELETE FROM user_activities WHERE user_id = ?").bind(userId).run(),
//     c.env.DB.prepare("DELETE FROM admin_users WHERE user_id = ?").bind(userId).run(),
//   ]);

//   // Delete user
//   const { success } = await c.env.DB.prepare(
//     "DELETE FROM users WHERE id = ?"
//   ).bind(userId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete user' }, 500);
//   }

//   // Log admin action
//   await c.env.DB.prepare(
//     "INSERT INTO user_activities (user_id, activity_type, description) VALUES (?, 'user_deletion', ?)"
//   ).bind(
//     currentUser?.id,
//     `User ${userId} deleted by admin`
//   ).run();

//   return c.json({ success: true });
// });

// app.post('/api/admin/venues', authMiddleware, adminMiddleware, zValidator('json', CreateVenueSchema), async (c) => {
//   const data = c.req.valid('json');
//   const user = c.get('user');

//   const { success, meta } = await c.env.DB.prepare(`
//     INSERT INTO venues (name, description, address, city, phone, email, image_url, capacity, owner_id)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `).bind(
//     data.name,
//     data.description || null,
//     data.address || null,
//     data.city || null,
//     data.phone || null,
//     data.email || null,
//     data.image_url || null,
//     data.capacity || null,
//     user?.id || null
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to create venue' }, 500);
//   }

//   const { results } = await c.env.DB.prepare(
//     "SELECT * FROM venues WHERE id = ?"
//   ).bind(meta.last_row_id).all();

//   return c.json(results[0], 201);
// });

// app.get('/api/admin/venues/:id', authMiddleware, adminMiddleware, async (c) => {
//   const venueId = c.req.param('id');

//   const { results } = await c.env.DB.prepare(
//     "SELECT * FROM venues WHERE id = ?"
//   ).bind(venueId).all();

//   if (results.length === 0) {
//     return c.json({ error: 'Venue not found' }, 404);
//   }

//   return c.json(results[0]);
// });

// app.put('/api/admin/venues/:id', authMiddleware, adminMiddleware, zValidator('json', CreateVenueSchema), async (c) => {
//   const venueId = c.req.param('id');
//   const data = c.req.valid('json');

//   const { success } = await c.env.DB.prepare(`
//     UPDATE venues SET 
//       name = ?, description = ?, address = ?, city = ?, phone = ?, 
//       email = ?, image_url = ?, capacity = ?, updated_at = CURRENT_TIMESTAMP
//     WHERE id = ?
//   `).bind(
//     data.name,
//     data.description || null,
//     data.address || null,
//     data.city || null,
//     data.phone || null,
//     data.email || null,
//     data.image_url || null,
//     data.capacity || null,
//     venueId
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update venue' }, 500);
//   }

//   const { results } = await c.env.DB.prepare(
//     "SELECT * FROM venues WHERE id = ?"
//   ).bind(venueId).all();

//   return c.json(results[0]);
// });

// app.delete('/api/admin/venues/:id', authMiddleware, adminMiddleware, async (c) => {
//   const venueId = c.req.param('id');

//   // Check if venue has associated events
//   const { results: events } = await c.env.DB.prepare(
//     "SELECT COUNT(*) as count FROM events WHERE venue_id = ?"
//   ).bind(venueId).all();

//   if (events.length > 0 && (events[0] as any)?.count > 0) {
//     return c.json({ error: 'Cannot delete venue with associated events' }, 400);
//   }

//   const { success } = await c.env.DB.prepare(
//     "DELETE FROM venues WHERE id = ?"
//   ).bind(venueId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete venue' }, 500);
//   }

//   return c.json({ success: true });
// });

// // Events API with pagination
// app.get('/api/admin/events', authMiddleware, adminMiddleware, zValidator('query', PaginationSchema), async (c) => {
//   const { page, limit, search, sort_by, sort_order, filters } = c.req.valid('query');
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   const parsedFilters = JSON.parse(filters);

//   // Build search and filter conditions
//   const searchFields = ['e.title', 'e.description', 'v.name'];
//   const { whereClause, bindings } = buildWhereClause(searchFields, search, parsedFilters);

//   // Build ORDER BY clause
//   let orderClause = 'ORDER BY e.created_at DESC';
//   if (sort_by) {
//     const validSortFields = ['title', 'event_date', 'status', 'created_at', 'base_price'];
//     if (validSortFields.includes(sort_by)) {
//       orderClause = `ORDER BY e.${sort_by} ${sort_order.toUpperCase()}`;
//     }
//   }

//   // Get total count
//   const countQuery = `
//     SELECT COUNT(*) as total 
//     FROM events e 
//     JOIN venues v ON e.venue_id = v.id 
//     ${whereClause}
//   `;
//   const { total } = await c.env.DB.prepare(countQuery).bind(...bindings).first() as any;

//   // Get paginated data
//   const dataQuery = `
//     SELECT e.*, v.name as venue_name, v.address as venue_address
//     FROM events e
//     JOIN venues v ON e.venue_id = v.id
//     ${whereClause}
//     ${orderClause}
//     LIMIT ? OFFSET ?
//   `;
//   const { results } = await c.env.DB.prepare(dataQuery).bind(...bindings, limitNum, offset).all();

//   return c.json({
//     data: results,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limitNum)
//     }
//   });
// });

// app.post('/api/admin/events', authMiddleware, adminMiddleware, zValidator('json', CreateEventSchema), async (c) => {
//   try {
//     const data = c.req.valid('json');
//     const user = c.get('user');

//     // Validate venue exists
//     const { results: venueCheck } = await c.env.DB.prepare(
//       "SELECT id FROM venues WHERE id = ?"
//     ).bind(data.venue_id).all();

//     if (venueCheck.length === 0) {
//       return c.json({ error: 'Selected venue does not exist' }, 400);
//     }

//     const { success, meta } = await c.env.DB.prepare(`
//       INSERT INTO events (title, description, venue_id, promoter_id, event_date, start_time, end_time, base_price, max_capacity, image_url, is_house_party, status)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
//     `).bind(
//       data.title,
//       data.description || null,
//       data.venue_id,
//       user?.id || null,
//       data.event_date,
//       data.start_time || null,
//       data.end_time || null,
//       data.base_price || null,
//       data.max_capacity || null,
//       data.image_url || null,
//       data.is_house_party ? 1 : 0
//     ).run();

//     if (!success) {
//       console.error('Database insert failed:', meta);
//       return c.json({ error: 'Failed to create event in database' }, 500);
//     }

//     // Get the created event with venue info
//     const { results } = await c.env.DB.prepare(`
//       SELECT e.*, v.name as venue_name, v.address as venue_address
//       FROM events e
//       JOIN venues v ON e.venue_id = v.id
//       WHERE e.id = ?
//     `).bind(meta?.last_row_id).all();

//     if (results.length === 0) {
//       return c.json({ error: 'Failed to retrieve created event' }, 500);
//     }

//     return c.json(results[0], 201);
//   } catch (error) {
//     console.error('Error creating event:', error);
//     return c.json({ error: 'Internal server error while creating event' }, 500);
//   }
// });

// app.patch('/api/admin/events/:id/status', authMiddleware, adminMiddleware, zValidator('json', UpdateEventStatusSchema), async (c) => {
//   const eventId = c.req.param('id');
//   const data = c.req.valid('json');

//   const { success } = await c.env.DB.prepare(
//     "UPDATE events SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
//   ).bind(data.status, eventId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update event status' }, 500);
//   }

//   return c.json({ success: true });
// });

// app.get('/api/admin/events/:id', authMiddleware, adminMiddleware, async (c) => {
//   const eventId = c.req.param('id');

//   const { results } = await c.env.DB.prepare(`
//     SELECT e.*, v.name as venue_name, v.address as venue_address
//     FROM events e
//     JOIN venues v ON e.venue_id = v.id
//     WHERE e.id = ?
//   `).bind(eventId).all();

//   if (results.length === 0) {
//     return c.json({ error: 'Event not found' }, 404);
//   }

//   return c.json(results[0]);
// });

// app.put('/api/admin/events/:id', authMiddleware, adminMiddleware, zValidator('json', CreateEventSchema), async (c) => {
//   const eventId = c.req.param('id');
//   const data = c.req.valid('json');

//   const { success } = await c.env.DB.prepare(`
//     UPDATE events SET 
//       title = ?, description = ?, venue_id = ?, event_date = ?, start_time = ?, 
//       end_time = ?, base_price = ?, max_capacity = ?, image_url = ?, 
//       is_house_party = ?, updated_at = CURRENT_TIMESTAMP
//     WHERE id = ?
//   `).bind(
//     data.title,
//     data.description || null,
//     data.venue_id,
//     data.event_date,
//     data.start_time || null,
//     data.end_time || null,
//     data.base_price || null,
//     data.max_capacity || null,
//     data.image_url || null,
//     data.is_house_party ? 1 : 0,
//     eventId
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update event' }, 500);
//   }

//   const { results } = await c.env.DB.prepare(`
//     SELECT e.*, v.name as venue_name, v.address as venue_address
//     FROM events e
//     JOIN venues v ON e.venue_id = v.id
//     WHERE e.id = ?
//   `).bind(eventId).all();

//   return c.json(results[0]);
// });

// app.delete('/api/admin/events/:id', authMiddleware, adminMiddleware, async (c) => {
//   const eventId = c.req.param('id');

//   // Check if event has bookings
//   const { results: bookings } = await c.env.DB.prepare(
//     "SELECT COUNT(*) as count FROM bookings WHERE event_id = ?"
//   ).bind(eventId).all();

//   if (bookings.length > 0 && (bookings[0] as any)?.count > 0) {
//     return c.json({ error: 'Cannot delete event with existing bookings' }, 400);
//   }

//   const { success } = await c.env.DB.prepare(
//     "DELETE FROM events WHERE id = ?"
//   ).bind(eventId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete event' }, 500);
//   }

//   return c.json({ success: true });
// });

// // Bookings API with pagination
// app.get('/api/admin/bookings', authMiddleware, adminMiddleware, zValidator('query', PaginationSchema), async (c) => {
//   const { page, limit, search, sort_by, sort_order, filters } = c.req.valid('query');
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   const parsedFilters = JSON.parse(filters);

//   // Build search and filter conditions
//   const searchFields = ['e.title', 'v.name', 'b.booking_reference'];
//   const { whereClause, bindings } = buildWhereClause(searchFields, search, parsedFilters);

//   // Build ORDER BY clause
//   let orderClause = 'ORDER BY b.created_at DESC';
//   if (sort_by) {
//     const validSortFields = ['created_at', 'event_date', 'total_amount', 'booking_status', 'payment_status'];
//     if (validSortFields.includes(sort_by)) {
//       const fieldPrefix = sort_by === 'event_date' ? 'e.' : 'b.';
//       orderClause = `ORDER BY ${fieldPrefix}${sort_by} ${sort_order.toUpperCase()}`;
//     }
//   }

//   // Get total count
//   const countQuery = `
//     SELECT COUNT(*) as total 
//     FROM bookings b
//     JOIN events e ON b.event_id = e.id
//     JOIN venues v ON e.venue_id = v.id
//     ${whereClause}
//   `;
//   const { total } = await c.env.DB.prepare(countQuery).bind(...bindings).first() as any;

//   // Get paginated data
//   const dataQuery = `
//     SELECT b.*, e.title as event_title, e.event_date, v.name as venue_name
//     FROM bookings b
//     JOIN events e ON b.event_id = e.id
//     JOIN venues v ON e.venue_id = v.id
//     ${whereClause}
//     ${orderClause}
//     LIMIT ? OFFSET ?
//   `;
//   const { results } = await c.env.DB.prepare(dataQuery).bind(...bindings, limitNum, offset).all();

//   return c.json({
//     data: results,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limitNum)
//     }
//   });
// });

// // Users API with pagination
// app.get('/api/admin/users', authMiddleware, adminMiddleware, zValidator('query', PaginationSchema), async (c) => {
//   const { page, limit, search, sort_by, sort_order, filters } = c.req.valid('query');
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   const parsedFilters = JSON.parse(filters);

//   // Build search and filter conditions with proper subscription handling
//   const conditions: string[] = [];
//   const bindings: any[] = [];

//   // Handle search
//   if (search) {
//     conditions.push('u.email LIKE ?');
//     bindings.push(`%${search}%`);
//   }

//   // Handle regular filters
//   Object.entries(parsedFilters).forEach(([key, value]) => {
//     if (value && value !== 'all') {
//       if (key === 'subscription.plan_type') {
//         // Handle new subscription plans: basic, gold, platinum
//         conditions.push('(s.plan_type = ? AND s.status = "active")');
//         bindings.push(value);
//       } else if (key === 'is_active') {
//         conditions.push(`u.${key} = ?`);
//         bindings.push(value);
//       }
//     }
//   });

//   const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

//   // Build ORDER BY clause
//   let orderClause = 'ORDER BY u.created_at DESC';
//   if (sort_by) {
//     const validSortFields = ['email', 'created_at', 'last_login', 'is_active'];
//     if (validSortFields.includes(sort_by)) {
//       orderClause = `ORDER BY u.${sort_by} ${sort_order.toUpperCase()}`;
//     }
//   }

//   // Get total count with proper joins
//   const countQuery = `
//     SELECT COUNT(DISTINCT u.id) as total 
//     FROM users u
//     LEFT JOIN user_subscriptions s ON u.id = s.user_id AND s.status = 'active'
//     ${whereClause}
//   `;
//   const { total } = await c.env.DB.prepare(countQuery).bind(...bindings).first() as any;

//   // Get paginated user data with subscription join
//   const dataQuery = `
//     SELECT DISTINCT u.id, u.email, u.google_user_data, u.created_at, u.last_login, u.is_active
//     FROM users u
//     LEFT JOIN user_subscriptions s ON u.id = s.user_id AND s.status = 'active'
//     ${whereClause}
//     ${orderClause}
//     LIMIT ? OFFSET ?
//   `;
//   const { results: users } = await c.env.DB.prepare(dataQuery).bind(...bindings, limitNum, offset).all();

//   // Get user stats and subscriptions for each user (optimized with batch queries)
//   const userIds = users.map((user: any) => user.id);
  
//   // Batch query for subscriptions
//   const subscriptionsQuery = userIds.length > 0 
//     ? `SELECT * FROM user_subscriptions WHERE user_id IN (${userIds.map(() => '?').join(',')}) AND status = 'active'`
//     : null;
  
//   const subscriptions = subscriptionsQuery 
//     ? await c.env.DB.prepare(subscriptionsQuery).bind(...userIds).all()
//     : { results: [] };

//   // Batch query for user stats
//   const statsPromises = userIds.map(async (userId: string) => {
//     const [bookingStats, totalSpent, eventsCreated] = await Promise.all([
//       c.env.DB.prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?").bind(userId).first(),
//       c.env.DB.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE user_id = ? AND payment_status = 'completed'").bind(userId).first(),
//       c.env.DB.prepare("SELECT COUNT(*) as count FROM events WHERE promoter_id = ?").bind(userId).first(),
//     ]);

//     return {
//       userId,
//       stats: {
//         total_bookings: (bookingStats as any)?.count || 0,
//         total_spent: (totalSpent as any)?.total || 0,
//         events_created: (eventsCreated as any)?.count || 0,
//       }
//     };
//   });

//   const userStats = await Promise.all(statsPromises);
//   const statsMap = new Map(userStats.map(s => [s.userId, s.stats]));
//   const subscriptionsMap = new Map(subscriptions.results.map((s: any) => [s.user_id, s]));

//   // Combine data
//   const usersWithData = users.map((user: any) => ({
//     ...user,
//     google_user_data: user.google_user_data ? JSON.parse(user.google_user_data) : {},
//     subscription: subscriptionsMap.get(user.id) || null,
//     stats: statsMap.get(user.id) || { total_bookings: 0, total_spent: 0, events_created: 0 },
//     recent_activity: [] // Skip recent activity for performance in paginated view
//   }));

//   return c.json({
//     data: usersWithData,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limitNum)
//     }
//   });
// });

// app.patch('/api/admin/users/:id/status', authMiddleware, adminMiddleware, zValidator('json', UpdateUserStatusSchema), async (c) => {
//   const userId = c.req.param('id');
//   const data = c.req.valid('json');
//   const currentUser = c.get('user');

//   // Log the activity
//   await c.env.DB.prepare(
//     "INSERT INTO user_activities (user_id, activity_type, description) VALUES (?, 'status_change', ?)"
//   ).bind(
//     userId, 
//     `Account ${data.is_active ? 'activated' : 'deactivated'} by admin ${currentUser?.email}`
//   ).run();

//   const { success } = await c.env.DB.prepare(
//     "UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
//   ).bind(data.is_active, userId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update user status' }, 500);
//   }

//   return c.json({ success: true });
// });

// app.patch('/api/admin/users/:id/subscription', authMiddleware, adminMiddleware, async (c) => {
//   const userId = c.req.param('id');
//   const body = await c.req.json();
//   const planType = body.plan_type;
//   const currentUser = c.get('user');

//   // Deactivate current subscription
//   await c.env.DB.prepare(
//     "UPDATE user_subscriptions SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND status = 'active'"
//   ).bind(userId).run();

//   // Create new subscription for all plan types
//   const prices = { basic: 0, gold: 35000, platinum: 65000 };
//   const price = prices[planType as keyof typeof prices] || 0;
  
//   // Create subscription for all plan types (basic is free but still tracked)
//   const expiresAt = new Date();
//   expiresAt.setMonth(expiresAt.getMonth() + 1);

//   await c.env.DB.prepare(`
//     INSERT INTO user_subscriptions (user_id, plan_type, status, started_at, expires_at, billing_cycle, price_paid, payment_method)
//     VALUES (?, ?, 'active', CURRENT_TIMESTAMP, ?, 'monthly', ?, 'admin_change')
//   `).bind(userId, planType, expiresAt.toISOString(), price).run();

//   // Log the activity
//   await c.env.DB.prepare(
//     "INSERT INTO user_activities (user_id, activity_type, description) VALUES (?, 'subscription_change', ?)"
//   ).bind(
//     userId, 
//     `Subscription changed to ${planType} by admin ${currentUser?.email}`
//   ).run();

//   return c.json({ success: true });
// });

// // Analytics API - optimized for performance
// app.get('/api/admin/analytics', authMiddleware, adminMiddleware, async (c) => {
//   const [venueCount, eventCount, storyCount, bookingCount, totalRevenue] = await Promise.all([
//     c.env.DB.prepare("SELECT COUNT(*) as count FROM venues").first(),
//     c.env.DB.prepare("SELECT COUNT(*) as count FROM events").first(),
//     c.env.DB.prepare("SELECT COUNT(*) as count FROM stories WHERE is_published = 1").first(),
//     c.env.DB.prepare("SELECT COUNT(*) as count FROM bookings").first(),
//     c.env.DB.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE payment_status = 'completed'").first(),
//   ]);

//   const recentBookings = await c.env.DB.prepare(`
//     SELECT b.*, e.title as event_title, v.name as venue_name
//     FROM bookings b
//     JOIN events e ON b.event_id = e.id
//     JOIN venues v ON e.venue_id = v.id
//     ORDER BY b.created_at DESC
//     LIMIT 10
//   `).all();

//   return c.json({
//     stats: {
//       venues: (venueCount as any)?.count || 0,
//       events: (eventCount as any)?.count || 0,
//       stories: (storyCount as any)?.count || 0,
//       bookings: (bookingCount as any)?.count || 0,
//       revenue: (totalRevenue as any)?.total || 0,
//     },
//     recentBookings: recentBookings.results,
//   });
// });

// // Bulk operations for better performance
// app.post('/api/admin/venues/bulk-delete', authMiddleware, adminMiddleware, async (c) => {
//   const { venueIds } = await c.req.json();
  
//   if (!Array.isArray(venueIds) || venueIds.length === 0) {
//     return c.json({ error: 'Invalid venue IDs' }, 400);
//   }

//   // Check for associated events
//   const placeholders = venueIds.map(() => '?').join(',');
//   const { results: events } = await c.env.DB.prepare(
//     `SELECT venue_id FROM events WHERE venue_id IN (${placeholders})`
//   ).bind(...venueIds).all();

//   if (events.length > 0) {
//     return c.json({ error: 'Cannot delete venues with associated events' }, 400);
//   }

//   // Delete venues
//   const { success } = await c.env.DB.prepare(
//     `DELETE FROM venues WHERE id IN (${placeholders})`
//   ).bind(...venueIds).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete venues' }, 500);
//   }

//   return c.json({ success: true, deleted: venueIds.length });
// });

// // User invitation system
// app.post('/api/admin/users/invite', authMiddleware, adminMiddleware, async (c) => {
//   const { emails, role, subscription_plan } = await c.req.json();
//   const currentUser = c.get('user');

//   if (!Array.isArray(emails) || emails.length === 0) {
//     return c.json({ error: 'No valid emails provided' }, 400);
//   }

//   let sentCount = 0;
//   const errors: string[] = [];

//   for (const email of emails) {
//     try {
//       // Check if user already exists
//       const { results: existingUsers } = await c.env.DB.prepare(
//         "SELECT id FROM users WHERE email = ?"
//       ).bind(email).all();

//       if (existingUsers.length > 0) {
//         errors.push(`User with email ${email} already exists`);
//         continue;
//       }

//       // For now, we'll create a placeholder user record that will be completed when they sign up
//       // In a real system, you'd send an actual email invitation
//       const userId = `invited_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
//       await c.env.DB.prepare(`
//         INSERT INTO users (id, email, is_active, created_at, updated_at)
//         VALUES (?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
//       `).bind(userId, email).run();

//       // Create initial subscription if not basic
//       if (subscription_plan !== 'basic') {
//         const prices = { basic: 0, gold: 35000, platinum: 65000 };
//         const price = prices[subscription_plan as keyof typeof prices] || 0;
        
//         const expiresAt = new Date();
//         expiresAt.setMonth(expiresAt.getMonth() + 1);

//         await c.env.DB.prepare(`
//           INSERT INTO user_subscriptions (user_id, plan_type, status, started_at, expires_at, billing_cycle, price_paid, payment_method)
//           VALUES (?, ?, 'pending', CURRENT_TIMESTAMP, ?, 'monthly', ?, 'invitation')
//         `).bind(userId, subscription_plan, expiresAt.toISOString(), price).run();
//       }

//       // Log the invitation
//       await c.env.DB.prepare(
//         "INSERT INTO user_activities (user_id, activity_type, description) VALUES (?, 'user_invited', ?)"
//       ).bind(
//         userId,
//         `Invited by admin ${currentUser?.email} with role ${role} and ${subscription_plan} plan`
//       ).run();

//       sentCount++;
//     } catch (error) {
//       console.error(`Failed to invite ${email}:`, error);
//       errors.push(`Failed to invite ${email}`);
//     }
//   }

//   return c.json({
//     sent: sentCount,
//     errors: errors.length > 0 ? errors : undefined,
//     message: `Successfully sent ${sentCount} invitation(s)`
//   });
// });

// // Get user subscription history
// app.get('/api/admin/users/:id/subscriptions', authMiddleware, adminMiddleware, async (c) => {
//   const userId = c.req.param('id');

//   const { results: subscriptions } = await c.env.DB.prepare(
//     "SELECT * FROM user_subscriptions WHERE user_id = ? ORDER BY created_at DESC"
//   ).bind(userId).all();

//   return c.json({ subscriptions });
// });

// // Get user payment history (mock data for now)
// app.get('/api/admin/users/:id/payments', authMiddleware, adminMiddleware, async (c) => {
//   const userId = c.req.param('id');

//   // For now, we'll derive payments from subscription data
//   const { results: subscriptions } = await c.env.DB.prepare(
//     "SELECT * FROM user_subscriptions WHERE user_id = ? AND price_paid > 0 ORDER BY created_at DESC"
//   ).bind(userId).all();

//   const payments = subscriptions.map((sub: any, index: number) => ({
//     id: index + 1,
//     amount: sub.price_paid,
//     currency: 'NGN',
//     status: 'completed',
//     payment_date: sub.started_at,
//     payment_method: sub.payment_method || 'card',
//     subscription_id: sub.id
//   }));

//   return c.json({ payments });
// });

// // Get user activity history
// app.get('/api/admin/users/:id/activity', authMiddleware, adminMiddleware, async (c) => {
//   const userId = c.req.param('id');

//   const { results: activities } = await c.env.DB.prepare(
//     "SELECT * FROM user_activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 100"
//   ).bind(userId).all();

//   return c.json({ activities });
// });

// // Wallet management endpoints
// app.get('/api/admin/users/:id/wallet', authMiddleware, adminMiddleware, async (c) => {
//   const userId = c.req.param('id');

//   // Get or create wallet
//   let { results: wallets } = await c.env.DB.prepare(
//     "SELECT * FROM user_wallets WHERE user_id = ?"
//   ).bind(userId).all();

//   if (wallets.length === 0) {
//     // Create wallet for user if it doesn't exist
//     await c.env.DB.prepare(
//       "INSERT INTO user_wallets (user_id, balance, currency) VALUES (?, 0.00, 'NGN')"
//     ).bind(userId).run();
    
//     const { results: newWallets } = await c.env.DB.prepare(
//       "SELECT * FROM user_wallets WHERE user_id = ?"
//     ).bind(userId).all();
//     wallets = newWallets;
//   }

//   return c.json({ wallet: wallets[0] });
// });

// app.get('/api/admin/users/:id/wallet/transactions', authMiddleware, adminMiddleware, async (c) => {
//   const userId = c.req.param('id');
//   const page = parseInt(c.req.query('page') || '1');
//   const limit = parseInt(c.req.query('limit') || '25');
//   const offset = (page - 1) * limit;

//   // Get total count
//   const { total } = await c.env.DB.prepare(
//     "SELECT COUNT(*) as total FROM wallet_transactions WHERE user_id = ?"
//   ).bind(userId).first() as any;

//   // Get paginated transactions
//   const { results: transactions } = await c.env.DB.prepare(
//     "SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
//   ).bind(userId, limit, offset).all();

//   return c.json({
//     transactions,
//     pagination: {
//       page,
//       limit,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limit)
//     }
//   });
// });

// app.post('/api/admin/users/:id/wallet/adjust', authMiddleware, adminMiddleware, zValidator('json', WalletAdjustmentSchema), async (c) => {
//   const userId = c.req.param('id');
//   const data = c.req.valid('json');
//   const currentUser = c.get('user');

//   try {
//     // Get current wallet balance
//     let { results: wallets } = await c.env.DB.prepare(
//       "SELECT * FROM user_wallets WHERE user_id = ?"
//     ).bind(userId).all();

//     if (wallets.length === 0) {
//       // Create wallet if it doesn't exist
//       await c.env.DB.prepare(
//         "INSERT INTO user_wallets (user_id, balance, currency) VALUES (?, 0.00, 'NGN')"
//       ).bind(userId).run();
      
//       const { results: newWallets } = await c.env.DB.prepare(
//         "SELECT * FROM user_wallets WHERE user_id = ?"
//       ).bind(userId).all();
//       wallets = newWallets;
//     }

//     const wallet = wallets[0] as any;
//     const currentBalance = wallet.balance;
//     let newBalance = currentBalance;
//     let adjustmentAmount = Math.abs(data.amount);

//     // Calculate new balance based on transaction type
//     if (data.transaction_type === 'deposit' || data.transaction_type === 'adjustment') {
//       if (data.amount > 0) {
//         newBalance = currentBalance + adjustmentAmount;
//       } else {
//         newBalance = currentBalance - adjustmentAmount;
//         adjustmentAmount = -adjustmentAmount;
//       }
//     } else if (data.transaction_type === 'withdrawal') {
//       if (currentBalance < adjustmentAmount) {
//         return c.json({ error: 'Insufficient balance for withdrawal' }, 400);
//       }
//       newBalance = currentBalance - adjustmentAmount;
//       adjustmentAmount = -adjustmentAmount;
//     }

//     // Update wallet balance
//     await c.env.DB.prepare(
//       "UPDATE user_wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
//     ).bind(newBalance, userId).run();

//     // Record transaction
//     await c.env.DB.prepare(`
//       INSERT INTO wallet_transactions (
//         user_id, transaction_type, amount, balance_before, balance_after, 
//         currency, description, status, processed_by
//       ) VALUES (?, ?, ?, ?, ?, 'NGN', ?, 'completed', ?)
//     `).bind(
//       userId,
//       data.transaction_type,
//       adjustmentAmount,
//       currentBalance,
//       newBalance,
//       data.description,
//       currentUser?.id
//     ).run();

//     // Log admin activity
//     await c.env.DB.prepare(
//       "INSERT INTO user_activities (user_id, activity_type, description) VALUES (?, 'wallet_adjustment', ?)"
//     ).bind(
//       userId,
//       `Wallet ${data.transaction_type} of ₦${Math.abs(adjustmentAmount)} by admin ${currentUser?.email}. ${data.description}`
//     ).run();

//     // Get updated wallet
//     const { results: updatedWallets } = await c.env.DB.prepare(
//       "SELECT * FROM user_wallets WHERE user_id = ?"
//     ).bind(userId).all();

//     return c.json({
//       success: true,
//       wallet: updatedWallets[0],
//       transaction: {
//         type: data.transaction_type,
//         amount: adjustmentAmount,
//         balance_before: currentBalance,
//         balance_after: newBalance,
//         description: data.description
//       }
//     });
//   } catch (error) {
//     console.error('Wallet adjustment error:', error);
//     return c.json({ error: 'Failed to adjust wallet balance' }, 500);
//   }
// });

// // Concierge Staff API
// app.get('/api/admin/concierge/staff', authMiddleware, adminMiddleware, zValidator('query', PaginationSchema), async (c) => {
//   const { page, limit, search, sort_by, sort_order, filters } = c.req.valid('query');
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   const parsedFilters = JSON.parse(filters);

//   // Build search and filter conditions
//   const searchFields = ['name', 'email', 'position', 'specialties'];
//   const { whereClause, bindings } = buildWhereClause(searchFields, search, parsedFilters);

//   // Build ORDER BY clause
//   let orderClause = 'ORDER BY created_at DESC';
//   if (sort_by) {
//     const validSortFields = ['name', 'email', 'position', 'hourly_rate', 'rating', 'created_at', 'is_active'];
//     if (validSortFields.includes(sort_by)) {
//       orderClause = `ORDER BY ${sort_by} ${sort_order.toUpperCase()}`;
//     }
//   }

//   // Get total count
//   const countQuery = `SELECT COUNT(*) as total FROM concierge_staff ${whereClause}`;
//   const { total } = await c.env.DB.prepare(countQuery).bind(...bindings).first() as any;

//   // Get paginated data with stats
//   const dataQuery = `SELECT * FROM concierge_staff ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
//   const { results: staff } = await c.env.DB.prepare(dataQuery).bind(...bindings, limitNum, offset).all();

//   // Get stats for each staff member
//   const staffWithStats = await Promise.all(staff.map(async (member: any) => {
//     const [activeRequests, completedRequests, totalRevenue] = await Promise.all([
//       c.env.DB.prepare("SELECT COUNT(*) as count FROM concierge_requests WHERE concierge_id = ? AND status IN ('pending', 'assigned', 'in_progress')").bind(member.id).first(),
//       c.env.DB.prepare("SELECT COUNT(*) as count FROM concierge_requests WHERE concierge_id = ? AND status = 'completed'").bind(member.id).first(),
//       c.env.DB.prepare("SELECT COALESCE(SUM(total_cost), 0) as total FROM concierge_requests WHERE concierge_id = ? AND status = 'completed' AND payment_status = 'paid'").bind(member.id).first(),
//     ]);

//     // Calculate average rating from completed requests
//     const avgRating = await c.env.DB.prepare("SELECT AVG(customer_rating) as avg_rating FROM concierge_requests WHERE concierge_id = ? AND customer_rating IS NOT NULL").bind(member.id).first();

//     return {
//       ...member,
//       rating: (avgRating as any)?.avg_rating || 0,
//       stats: {
//         active_requests: (activeRequests as any)?.count || 0,
//         completed_requests: (completedRequests as any)?.count || 0,
//         total_revenue: (totalRevenue as any)?.total || 0,
//         average_rating: (avgRating as any)?.avg_rating || 0,
//       }
//     };
//   }));

//   return c.json({
//     data: staffWithStats,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limitNum)
//     }
//   });
// });

// app.post('/api/admin/concierge/staff', authMiddleware, adminMiddleware, zValidator('json', CreateConciergeStaffSchema), async (c) => {
//   const data = c.req.valid('json');

//   const { success, meta } = await c.env.DB.prepare(`
//     INSERT INTO concierge_staff (name, email, phone, position, specialties, hourly_rate, availability_schedule, venue_id, profile_image, languages, experience_years)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `).bind(
//     data.name,
//     data.email,
//     data.phone || null,
//     data.position,
//     data.specialties || null,
//     data.hourly_rate || null,
//     data.availability_schedule || null,
//     data.venue_id || null,
//     data.profile_image || null,
//     data.languages || null,
//     data.experience_years || null
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to create staff member' }, 500);
//   }

//   const { results } = await c.env.DB.prepare("SELECT * FROM concierge_staff WHERE id = ?").bind(meta.last_row_id).all();
//   return c.json(results[0], 201);
// });

// app.get('/api/admin/concierge/staff/:id', authMiddleware, adminMiddleware, async (c) => {
//   const staffId = c.req.param('id');
//   const { results } = await c.env.DB.prepare("SELECT * FROM concierge_staff WHERE id = ?").bind(staffId).all();

//   if (results.length === 0) {
//     return c.json({ error: 'Staff member not found' }, 404);
//   }

//   return c.json(results[0]);
// });

// app.put('/api/admin/concierge/staff/:id', authMiddleware, adminMiddleware, zValidator('json', CreateConciergeStaffSchema), async (c) => {
//   const staffId = c.req.param('id');
//   const data = c.req.valid('json');

//   const { success } = await c.env.DB.prepare(`
//     UPDATE concierge_staff SET 
//       name = ?, email = ?, phone = ?, position = ?, specialties = ?, 
//       hourly_rate = ?, availability_schedule = ?, venue_id = ?, 
//       profile_image = ?, languages = ?, experience_years = ?, updated_at = CURRENT_TIMESTAMP
//     WHERE id = ?
//   `).bind(
//     data.name,
//     data.email,
//     data.phone || null,
//     data.position,
//     data.specialties || null,
//     data.hourly_rate || null,
//     data.availability_schedule || null,
//     data.venue_id || null,
//     data.profile_image || null,
//     data.languages || null,
//     data.experience_years || null,
//     staffId
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update staff member' }, 500);
//   }

//   const { results } = await c.env.DB.prepare("SELECT * FROM concierge_staff WHERE id = ?").bind(staffId).all();
//   return c.json(results[0]);
// });

// app.delete('/api/admin/concierge/staff/:id', authMiddleware, adminMiddleware, async (c) => {
//   const staffId = c.req.param('id');

//   // Check if staff has active requests
//   const { results: activeRequests } = await c.env.DB.prepare(
//     "SELECT COUNT(*) as count FROM concierge_requests WHERE concierge_id = ? AND status IN ('pending', 'assigned', 'in_progress')"
//   ).bind(staffId).all();

//   if (activeRequests.length > 0 && (activeRequests[0] as any)?.count > 0) {
//     return c.json({ error: 'Cannot delete staff member with active requests' }, 400);
//   }

//   const { success } = await c.env.DB.prepare("DELETE FROM concierge_staff WHERE id = ?").bind(staffId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete staff member' }, 500);
//   }

//   return c.json({ success: true });
// });

// // Concierge Services API
// app.get('/api/admin/concierge/services', authMiddleware, adminMiddleware, zValidator('query', PaginationSchema), async (c) => {
//   const { page, limit, search, sort_by, sort_order, filters } = c.req.valid('query');
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   const parsedFilters = JSON.parse(filters);

//   // Build search and filter conditions
//   const searchFields = ['name', 'description', 'category'];
//   const { whereClause, bindings } = buildWhereClause(searchFields, search, parsedFilters);

//   // Build ORDER BY clause
//   let orderClause = 'ORDER BY created_at DESC';
//   if (sort_by) {
//     const validSortFields = ['name', 'category', 'base_price', 'duration_minutes', 'created_at', 'is_available'];
//     if (validSortFields.includes(sort_by)) {
//       orderClause = `ORDER BY ${sort_by} ${sort_order.toUpperCase()}`;
//     }
//   }

//   // Get total count
//   const countQuery = `SELECT COUNT(*) as total FROM concierge_services ${whereClause}`;
//   const { total } = await c.env.DB.prepare(countQuery).bind(...bindings).first() as any;

//   // Get paginated data
//   const dataQuery = `SELECT * FROM concierge_services ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
//   const { results } = await c.env.DB.prepare(dataQuery).bind(...bindings, limitNum, offset).all();

//   return c.json({
//     data: results,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limitNum)
//     }
//   });
// });

// app.post('/api/admin/concierge/services', authMiddleware, adminMiddleware, zValidator('json', CreateConciergeServiceSchema), async (c) => {
//   const data = c.req.valid('json');

//   const { success, meta } = await c.env.DB.prepare(`
//     INSERT INTO concierge_services (name, description, category, base_price, price_type, duration_minutes, venue_id, requirements, max_capacity, advance_booking_hours)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `).bind(
//     data.name,
//     data.description || null,
//     data.category,
//     data.base_price || null,
//     data.price_type,
//     data.duration_minutes || null,
//     data.venue_id || null,
//     data.requirements || null,
//     data.max_capacity || null,
//     data.advance_booking_hours
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to create service' }, 500);
//   }

//   const { results } = await c.env.DB.prepare("SELECT * FROM concierge_services WHERE id = ?").bind(meta.last_row_id).all();
//   return c.json(results[0], 201);
// });

// app.get('/api/admin/concierge/services/:id', authMiddleware, adminMiddleware, async (c) => {
//   const serviceId = c.req.param('id');
//   const { results } = await c.env.DB.prepare("SELECT * FROM concierge_services WHERE id = ?").bind(serviceId).all();

//   if (results.length === 0) {
//     return c.json({ error: 'Service not found' }, 404);
//   }

//   return c.json(results[0]);
// });

// app.put('/api/admin/concierge/services/:id', authMiddleware, adminMiddleware, zValidator('json', CreateConciergeServiceSchema), async (c) => {
//   const serviceId = c.req.param('id');
//   const data = c.req.valid('json');

//   const { success } = await c.env.DB.prepare(`
//     UPDATE concierge_services SET 
//       name = ?, description = ?, category = ?, base_price = ?, price_type = ?, 
//       duration_minutes = ?, venue_id = ?, requirements = ?, max_capacity = ?, 
//       advance_booking_hours = ?, updated_at = CURRENT_TIMESTAMP
//     WHERE id = ?
//   `).bind(
//     data.name,
//     data.description || null,
//     data.category,
//     data.base_price || null,
//     data.price_type,
//     data.duration_minutes || null,
//     data.venue_id || null,
//     data.requirements || null,
//     data.max_capacity || null,
//     data.advance_booking_hours,
//     serviceId
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update service' }, 500);
//   }

//   const { results } = await c.env.DB.prepare("SELECT * FROM concierge_services WHERE id = ?").bind(serviceId).all();
//   return c.json(results[0]);
// });

// app.delete('/api/admin/concierge/services/:id', authMiddleware, adminMiddleware, async (c) => {
//   const serviceId = c.req.param('id');

//   // Check if service has active requests
//   const { results: activeRequests } = await c.env.DB.prepare(
//     "SELECT COUNT(*) as count FROM concierge_requests WHERE service_id = ? AND status IN ('pending', 'assigned', 'in_progress')"
//   ).bind(serviceId).all();

//   if (activeRequests.length > 0 && (activeRequests[0] as any)?.count > 0) {
//     return c.json({ error: 'Cannot delete service with active requests' }, 400);
//   }

//   const { success } = await c.env.DB.prepare("DELETE FROM concierge_services WHERE id = ?").bind(serviceId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete service' }, 500);
//   }

//   return c.json({ success: true });
// });

// // Concierge Requests API
// app.get('/api/admin/concierge/requests', authMiddleware, adminMiddleware, zValidator('query', PaginationSchema), async (c) => {
//   const { page, limit, search, sort_by, sort_order, filters } = c.req.valid('query');
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   const parsedFilters = JSON.parse(filters);

//   // Build search and filter conditions
//   const searchFields = ['r.title', 'r.description', 'r.request_type'];
//   const { whereClause, bindings } = buildWhereClause(searchFields, search, parsedFilters);

//   // Build ORDER BY clause
//   let orderClause = 'ORDER BY r.created_at DESC';
//   if (sort_by) {
//     const validSortFields = ['title', 'status', 'priority', 'preferred_date', 'total_cost', 'created_at'];
//     if (validSortFields.includes(sort_by)) {
//       orderClause = `ORDER BY r.${sort_by} ${sort_order.toUpperCase()}`;
//     }
//   }

//   // Get total count
//   const countQuery = `
//     SELECT COUNT(*) as total 
//     FROM concierge_requests r
//     LEFT JOIN concierge_staff cs ON r.concierge_id = cs.id
//     LEFT JOIN concierge_services s ON r.service_id = s.id
//     LEFT JOIN venues v ON r.venue_id = v.id
//     LEFT JOIN events e ON r.event_id = e.id
//     ${whereClause}
//   `;
//   const { total } = await c.env.DB.prepare(countQuery).bind(...bindings).first() as any;

//   // Get paginated data with joins
//   const dataQuery = `
//     SELECT r.*, 
//            cs.name as concierge_name, cs.email as concierge_email,
//            s.name as service_name, s.category as service_category,
//            v.name as venue_name, v.address as venue_address,
//            e.title as event_title, e.event_date
//     FROM concierge_requests r
//     LEFT JOIN concierge_staff cs ON r.concierge_id = cs.id
//     LEFT JOIN concierge_services s ON r.service_id = s.id
//     LEFT JOIN venues v ON r.venue_id = v.id
//     LEFT JOIN events e ON r.event_id = e.id
//     ${whereClause}
//     ${orderClause}
//     LIMIT ? OFFSET ?
//   `;
//   const { results } = await c.env.DB.prepare(dataQuery).bind(...bindings, limitNum, offset).all();

//   // Transform results to include nested objects
//   const transformedResults = results.map((request: any) => ({
//     ...request,
//     concierge: request.concierge_name ? {
//       id: request.concierge_id,
//       name: request.concierge_name,
//       email: request.concierge_email,
//     } : null,
//     service: request.service_name ? {
//       id: request.service_id,
//       name: request.service_name,
//       category: request.service_category,
//     } : null,
//     venue: request.venue_name ? {
//       id: request.venue_id,
//       name: request.venue_name,
//       address: request.venue_address,
//     } : null,
//     event: request.event_title ? {
//       id: request.event_id,
//       title: request.event_title,
//       event_date: request.event_date,
//     } : null,
//   }));

//   return c.json({
//     data: transformedResults,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limitNum)
//     }
//   });
// });

// app.post('/api/admin/concierge/requests', authMiddleware, adminMiddleware, zValidator('json', CreateConciergeRequestSchema), async (c) => {
//   const data = c.req.valid('json');
//   const user = c.get('user');

//   const { success, meta } = await c.env.DB.prepare(`
//     INSERT INTO concierge_requests (user_id, service_id, venue_id, event_id, request_type, title, description, preferred_date, preferred_time, guest_count, budget_range, special_requirements, priority)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `).bind(
//     user?.id || 'admin',
//     data.service_id || null,
//     data.venue_id || null,
//     data.event_id || null,
//     data.request_type,
//     data.title,
//     data.description || null,
//     data.preferred_date || null,
//     data.preferred_time || null,
//     data.guest_count,
//     data.budget_range || null,
//     data.special_requirements || null,
//     data.priority
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to create request' }, 500);
//   }

//   const { results } = await c.env.DB.prepare("SELECT * FROM concierge_requests WHERE id = ?").bind(meta.last_row_id).all();
//   return c.json(results[0], 201);
// });

// app.get('/api/admin/concierge/requests/:id', authMiddleware, adminMiddleware, async (c) => {
//   const requestId = c.req.param('id');
  
//   const { results } = await c.env.DB.prepare(`
//     SELECT r.*, 
//            cs.name as concierge_name, cs.email as concierge_email,
//            s.name as service_name, s.category as service_category,
//            v.name as venue_name, v.address as venue_address,
//            e.title as event_title, e.event_date
//     FROM concierge_requests r
//     LEFT JOIN concierge_staff cs ON r.concierge_id = cs.id
//     LEFT JOIN concierge_services s ON r.service_id = s.id
//     LEFT JOIN venues v ON r.venue_id = v.id
//     LEFT JOIN events e ON r.event_id = e.id
//     WHERE r.id = ?
//   `).bind(requestId).all();

//   if (results.length === 0) {
//     return c.json({ error: 'Request not found' }, 404);
//   }

//   const request = results[0] as any;
//   return c.json({
//     ...request,
//     concierge: request.concierge_name ? {
//       id: request.concierge_id,
//       name: request.concierge_name,
//       email: request.concierge_email,
//     } : null,
//     service: request.service_name ? {
//       id: request.service_id,
//       name: request.service_name,
//       category: request.service_category,
//     } : null,
//     venue: request.venue_name ? {
//       id: request.venue_id,
//       name: request.venue_name,
//       address: request.venue_address,
//     } : null,
//     event: request.event_title ? {
//       id: request.event_id,
//       title: request.event_title,
//       event_date: request.event_date,
//     } : null,
//   });
// });

// app.put('/api/admin/concierge/requests/:id', authMiddleware, adminMiddleware, zValidator('json', UpdateConciergeRequestSchema), async (c) => {
//   const requestId = c.req.param('id');
//   const data = c.req.valid('json');

//   // Build update query dynamically
//   const updateFields = [];
//   const bindings = [];

//   if (data.concierge_id !== undefined) {
//     updateFields.push('concierge_id = ?');
//     bindings.push(data.concierge_id);
    
//     if (data.concierge_id && !data.status) {
//       updateFields.push('assigned_at = CURRENT_TIMESTAMP');
//     }
//   }

//   if (data.status !== undefined) {
//     updateFields.push('status = ?');
//     bindings.push(data.status);
    
//     if (data.status === 'completed') {
//       updateFields.push('completed_at = CURRENT_TIMESTAMP');
//     }
//   }

//   if (data.priority !== undefined) {
//     updateFields.push('priority = ?');
//     bindings.push(data.priority);
//   }

//   if (data.total_cost !== undefined) {
//     updateFields.push('total_cost = ?');
//     bindings.push(data.total_cost);
//   }

//   if (data.payment_status !== undefined) {
//     updateFields.push('payment_status = ?');
//     bindings.push(data.payment_status);
//   }

//   if (data.internal_notes !== undefined) {
//     updateFields.push('internal_notes = ?');
//     bindings.push(data.internal_notes);
//   }

//   if (updateFields.length === 0) {
//     return c.json({ error: 'No fields to update' }, 400);
//   }

//   updateFields.push('updated_at = CURRENT_TIMESTAMP');
//   bindings.push(requestId);

//   const { success } = await c.env.DB.prepare(`
//     UPDATE concierge_requests SET ${updateFields.join(', ')} WHERE id = ?
//   `).bind(...bindings).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update request' }, 500);
//   }

//   const { results } = await c.env.DB.prepare("SELECT * FROM concierge_requests WHERE id = ?").bind(requestId).all();
//   return c.json(results[0]);
// });

// app.delete('/api/admin/concierge/requests/:id', authMiddleware, adminMiddleware, async (c) => {
//   const requestId = c.req.param('id');

//   const { success } = await c.env.DB.prepare("DELETE FROM concierge_requests WHERE id = ?").bind(requestId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete request' }, 500);
//   }

//   return c.json({ success: true });
// });

// // Venue Products API
// app.get('/api/admin/venues/:id/products', authMiddleware, adminMiddleware, async (c) => {
//   const venueId = c.req.param('id');

//   const { results } = await c.env.DB.prepare(`
//     SELECT * FROM venue_products WHERE venue_id = ? ORDER BY category, name
//   `).bind(venueId).all();

//   return c.json(results);
// });

// app.put('/api/admin/venues/:id/products', authMiddleware, adminMiddleware, async (c) => {
//   const venueId = c.req.param('id');
//   const { products } = await c.req.json();

//   if (!Array.isArray(products)) {
//     return c.json({ error: 'Products must be an array' }, 400);
//   }

//   try {
//     // Delete existing products for this venue
//     await c.env.DB.prepare('DELETE FROM venue_products WHERE venue_id = ?').bind(venueId).run();

//     // Insert new products
//     for (const product of products) {
//       if (!product.name || !product.category) {
//         continue; // Skip invalid products
//       }

//       await c.env.DB.prepare(`
//         INSERT INTO venue_products (
//           venue_id, name, category, subcategory, price, currency, description,
//           image_url, is_available, is_featured, minimum_order, serving_size,
//           alcohol_content, flavor_profile, brand, origin_country, 
//           preparation_time_minutes, ingredients, dietary_restrictions
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `).bind(
//         venueId,
//         product.name,
//         product.category,
//         product.subcategory || null,
//         product.price || null,
//         product.currency || 'NGN',
//         product.description || null,
//         product.image_url || null,
//         product.is_available ? 1 : 0,
//         product.is_featured ? 1 : 0,
//         product.minimum_order || 1,
//         product.serving_size || null,
//         product.alcohol_content || null,
//         product.flavor_profile || null,
//         product.brand || null,
//         product.origin_country || null,
//         product.preparation_time_minutes || null,
//         product.ingredients || null,
//         product.dietary_restrictions || null
//       ).run();
//     }

//     return c.json({ success: true });
//   } catch (error) {
//     console.error('Error updating venue products:', error);
//     return c.json({ error: 'Failed to update products' }, 500);
//   }
// });

// app.get('/api/admin/venue-product-categories', authMiddleware, adminMiddleware, async (c) => {
//   const { results } = await c.env.DB.prepare(
//     'SELECT * FROM venue_product_categories WHERE is_active = 1 ORDER BY sort_order, display_name'
//   ).all();

//   return c.json(results);
// });

// // Stories API with pagination
// app.get('/api/admin/stories', authMiddleware, adminMiddleware, zValidator('query', PaginationSchema), async (c) => {
//   const { page, limit, search, sort_by, sort_order, filters } = c.req.valid('query');
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   const parsedFilters = JSON.parse(filters);

//   // Build search and filter conditions
//   const searchFields = ['s.title', 's.content', 's.story_type'];
//   const { whereClause, bindings } = buildWhereClause(searchFields, search, parsedFilters);

//   // Build ORDER BY clause
//   let orderClause = 'ORDER BY s.created_at DESC';
//   if (sort_by) {
//     const validSortFields = ['title', 'story_type', 'is_published', 'publish_date', 'view_count', 'like_count', 'created_at'];
//     if (validSortFields.includes(sort_by)) {
//       orderClause = `ORDER BY s.${sort_by} ${sort_order.toUpperCase()}`;
//     }
//   }

//   // Get total count
//   const countQuery = `
//     SELECT COUNT(*) as total 
//     FROM stories s
//     LEFT JOIN venues v ON s.venue_id = v.id
//     LEFT JOIN events e ON s.event_id = e.id
//     ${whereClause}
//   `;
//   const { total } = await c.env.DB.prepare(countQuery).bind(...bindings).first() as any;

//   // Get paginated data with joins
//   const dataQuery = `
//     SELECT s.*, 
//            v.name as venue_name, v.address as venue_address,
//            e.title as event_title, e.event_date
//     FROM stories s
//     LEFT JOIN venues v ON s.venue_id = v.id
//     LEFT JOIN events e ON s.event_id = e.id
//     ${whereClause}
//     ${orderClause}
//     LIMIT ? OFFSET ?
//   `;
//   const { results } = await c.env.DB.prepare(dataQuery).bind(...bindings, limitNum, offset).all();

//   // Transform results to include nested objects
//   const transformedResults = results.map((story: any) => ({
//     ...story,
//     venue: story.venue_name ? {
//       id: story.venue_id,
//       name: story.venue_name,
//       address: story.venue_address,
//     } : null,
//     event: story.event_title ? {
//       id: story.event_id,
//       title: story.event_title,
//       event_date: story.event_date,
//     } : null,
//   }));

//   return c.json({
//     data: transformedResults,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total: total || 0,
//       pages: Math.ceil((total || 0) / limitNum)
//     }
//   });
// });

// app.post('/api/admin/stories', authMiddleware, adminMiddleware, zValidator('json', CreateStorySchema), async (c) => {
//   const data = c.req.valid('json');
//   const user = c.get('user');

//   const { success, meta } = await c.env.DB.prepare(`
//     INSERT INTO stories (title, content, story_type, venue_id, event_id, author_id, media_url, media_type, thumbnail_url, is_featured, publish_date, expires_at, tags)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `).bind(
//     data.title,
//     data.content || null,
//     data.story_type,
//     data.venue_id || null,
//     data.event_id || null,
//     user?.id || null,
//     data.media_url || null,
//     data.media_type || null,
//     null,
//     data.is_featured ? 1 : 0,
//     data.publish_date || null,
//     data.expires_at || null,
//     data.tags || null
//   ).run();

//   if (!success) {
//     return c.json({ error: 'Failed to create story' }, 500);
//   }

//   const { results } = await c.env.DB.prepare("SELECT * FROM stories WHERE id = ?").bind(meta.last_row_id).all();
//   return c.json(results[0], 201);
// });

// app.get('/api/admin/stories/:id', authMiddleware, adminMiddleware, async (c) => {
//   const storyId = c.req.param('id');
  
//   const { results } = await c.env.DB.prepare(`
//     SELECT s.*, 
//            v.name as venue_name, v.address as venue_address,
//            e.title as event_title, e.event_date
//     FROM stories s
//     LEFT JOIN venues v ON s.venue_id = v.id
//     LEFT JOIN events e ON s.event_id = e.id
//     WHERE s.id = ?
//   `).bind(storyId).all();

//   if (results.length === 0) {
//     return c.json({ error: 'Story not found' }, 404);
//   }

//   const story = results[0] as any;
//   return c.json({
//     ...story,
//     venue: story.venue_name ? {
//       id: story.venue_id,
//       name: story.venue_name,
//       address: story.venue_address,
//     } : null,
//     event: story.event_title ? {
//       id: story.event_id,
//       title: story.event_title,
//       event_date: story.event_date,
//     } : null,
//   });
// });

// app.put('/api/admin/stories/:id', authMiddleware, adminMiddleware, zValidator('json', UpdateStorySchema), async (c) => {
//   const storyId = c.req.param('id');
//   const data = c.req.valid('json');

//   // Build update query dynamically
//   const updateFields = [];
//   const bindings = [];

//   if (data.title !== undefined) {
//     updateFields.push('title = ?');
//     bindings.push(data.title);
//   }

//   if (data.content !== undefined) {
//     updateFields.push('content = ?');
//     bindings.push(data.content);
//   }

//   if (data.story_type !== undefined) {
//     updateFields.push('story_type = ?');
//     bindings.push(data.story_type);
//   }

//   if (data.venue_id !== undefined) {
//     updateFields.push('venue_id = ?');
//     bindings.push(data.venue_id);
//   }

//   if (data.event_id !== undefined) {
//     updateFields.push('event_id = ?');
//     bindings.push(data.event_id);
//   }

//   if (data.media_url !== undefined) {
//     updateFields.push('media_url = ?');
//     bindings.push(data.media_url);
//   }

//   if (data.media_type !== undefined) {
//     updateFields.push('media_type = ?');
//     bindings.push(data.media_type);
//   }

//   // Thumbnail URL removed - video only feature

//   if (data.is_published !== undefined) {
//     updateFields.push('is_published = ?');
//     bindings.push(data.is_published ? 1 : 0);
//   }

//   if (data.is_featured !== undefined) {
//     updateFields.push('is_featured = ?');
//     bindings.push(data.is_featured ? 1 : 0);
//   }

//   if (data.publish_date !== undefined) {
//     updateFields.push('publish_date = ?');
//     bindings.push(data.publish_date);
//   }

//   if (data.expires_at !== undefined) {
//     updateFields.push('expires_at = ?');
//     bindings.push(data.expires_at);
//   }

//   if (data.tags !== undefined) {
//     updateFields.push('tags = ?');
//     bindings.push(data.tags);
//   }

//   if (updateFields.length === 0) {
//     return c.json({ error: 'No fields to update' }, 400);
//   }

//   updateFields.push('updated_at = CURRENT_TIMESTAMP');
//   bindings.push(storyId);

//   const { success } = await c.env.DB.prepare(`
//     UPDATE stories SET ${updateFields.join(', ')} WHERE id = ?
//   `).bind(...bindings).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update story' }, 500);
//   }

//   const { results } = await c.env.DB.prepare("SELECT * FROM stories WHERE id = ?").bind(storyId).all();
//   return c.json(results[0]);
// });

// app.delete('/api/admin/stories/:id', authMiddleware, adminMiddleware, async (c) => {
//   const storyId = c.req.param('id');

//   // Delete related interactions first
//   await c.env.DB.prepare("DELETE FROM story_interactions WHERE story_id = ?").bind(storyId).run();

//   // Delete the story
//   const { success } = await c.env.DB.prepare("DELETE FROM stories WHERE id = ?").bind(storyId).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete story' }, 500);
//   }

//   return c.json({ success: true });
// });

// // Story interactions endpoint
// app.get('/api/admin/stories/:id/interactions', authMiddleware, adminMiddleware, async (c) => {
//   const storyId = c.req.param('id');

//   const { results } = await c.env.DB.prepare(
//     "SELECT * FROM story_interactions WHERE story_id = ? ORDER BY created_at DESC LIMIT 100"
//   ).bind(storyId).all();

//   return c.json({ interactions: results });
// });

// // Bulk story operations
// app.post('/api/admin/stories/bulk-publish', authMiddleware, adminMiddleware, async (c) => {
//   const { storyIds, is_published } = await c.req.json();
  
//   if (!Array.isArray(storyIds) || storyIds.length === 0) {
//     return c.json({ error: 'Invalid story IDs' }, 400);
//   }

//   const placeholders = storyIds.map(() => '?').join(',');
//   const { success } = await c.env.DB.prepare(
//     `UPDATE stories SET is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`
//   ).bind(is_published ? 1 : 0, ...storyIds).run();

//   if (!success) {
//     return c.json({ error: 'Failed to update stories' }, 500);
//   }

//   return c.json({ success: true, updated: storyIds.length });
// });

// app.post('/api/admin/stories/bulk-delete', authMiddleware, adminMiddleware, async (c) => {
//   const { storyIds } = await c.req.json();
  
//   if (!Array.isArray(storyIds) || storyIds.length === 0) {
//     return c.json({ error: 'Invalid story IDs' }, 400);
//   }

//   const placeholders = storyIds.map(() => '?').join(',');
  
//   // Delete interactions first
//   await c.env.DB.prepare(
//     `DELETE FROM story_interactions WHERE story_id IN (${placeholders})`
//   ).bind(...storyIds).run();

//   // Delete stories
//   const { success } = await c.env.DB.prepare(
//     `DELETE FROM stories WHERE id IN (${placeholders})`
//   ).bind(...storyIds).run();

//   if (!success) {
//     return c.json({ error: 'Failed to delete stories' }, 500);
//   }

//   return c.json({ success: true, deleted: storyIds.length });
// });

// // Image upload endpoint
// app.post('/api/admin/upload/image', authMiddleware, adminMiddleware, async (c) => {
//   try {
//     const formData = await c.req.formData();
//     const file = formData.get('image') as File;

//     if (!file) {
//       return c.json({ error: 'No image file provided' }, 400);
//     }

//     // Validate file type
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//     if (!allowedTypes.includes(file.type)) {
//       return c.json({ error: 'File must be a valid image (JPEG, PNG, WebP)' }, 400);
//     }

//     // Validate file size (max 10MB)
//     const maxSize = 10 * 1024 * 1024; // 10MB
//     if (file.size > maxSize) {
//       return c.json({ error: 'Image file size must be less than 10MB' }, 400);
//     }

//     // Generate unique filename with timestamp and random string
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substring(2, 8);
//     const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
//     const fileName = `images/${timestamp}_${randomString}.${fileExtension}`;

//     // Upload to R2
//     const arrayBuffer = await file.arrayBuffer();
//     const uploadResult = await c.env.R2_BUCKET.put(fileName, arrayBuffer, {
//       httpMetadata: {
//         contentType: file.type,
//         cacheControl: 'public, max-age=31536000', // 1 year cache
//       },
//       customMetadata: {
//         originalName: file.name,
//         uploadedBy: c.get('user')?.id || 'unknown',
//         uploadedAt: new Date().toISOString(),
//       },
//     });

//     if (!uploadResult) {
//       return c.json({ error: 'Failed to upload image' }, 500);
//     }

//     // Return the URL that can be used to access the image
//     const imageUrl = `/api/images/${fileName}`;

//     return c.json({
//       url: imageUrl,
//       fileName: fileName,
//       originalName: file.name,
//       size: file.size,
//       type: file.type,
//     });
//   } catch (error) {
//     console.error('Image upload error:', error);
//     return c.json({ error: 'Failed to upload image' }, 500);
//   }
// });

// // Video upload endpoint
// app.post('/api/admin/upload/video', authMiddleware, adminMiddleware, async (c) => {
//   try {
//     const formData = await c.req.formData();
//     const file = formData.get('video') as File;

//     if (!file) {
//       return c.json({ error: 'No video file provided' }, 400);
//     }

//     // Validate file type
//     if (!file.type.startsWith('video/')) {
//       return c.json({ error: 'File must be a video' }, 400);
//     }

//     // Validate file size (max 100MB)
//     const maxSize = 100 * 1024 * 1024; // 100MB
//     if (file.size > maxSize) {
//       return c.json({ error: 'Video file size must be less than 100MB' }, 400);
//     }

//     // Generate unique filename with timestamp and random string
//     const timestamp = Date.now();
//     const randomString = Math.random().toString(36).substring(2, 8);
//     const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'mp4';
//     const fileName = `stories/${timestamp}_${randomString}.${fileExtension}`;

//     // Upload to R2
//     const arrayBuffer = await file.arrayBuffer();
//     const uploadResult = await c.env.R2_BUCKET.put(fileName, arrayBuffer, {
//       httpMetadata: {
//         contentType: file.type,
//         cacheControl: 'public, max-age=31536000', // 1 year cache
//       },
//       customMetadata: {
//         originalName: file.name,
//         uploadedBy: c.get('user')?.id || 'unknown',
//         uploadedAt: new Date().toISOString(),
//       },
//     });

//     if (!uploadResult) {
//       return c.json({ error: 'Failed to upload video' }, 500);
//     }

//     // Return the URL that can be used to access the video
//     const videoUrl = `/api/videos/${fileName}`;

//     return c.json({
//       url: videoUrl,
//       fileName: fileName,
//       originalName: file.name,
//       size: file.size,
//       type: file.type,
//     });
//   } catch (error) {
//     console.error('Video upload error:', error);
//     return c.json({ error: 'Failed to upload video' }, 500);
//   }
// });

// // Image serving endpoint
// app.get('/api/images/:filename{.+}', async (c) => {
//   try {
//     const filename = c.req.param('filename');
    
//     // Get the image from R2
//     const object = await c.env.R2_BUCKET.get(filename);
    
//     if (!object) {
//       return c.json({ error: 'Image not found' }, 404);
//     }

//     // Set appropriate headers for image serving
//     const headers = new Headers();
//     object.writeHttpMetadata(headers);
//     headers.set('etag', object.httpEtag);
//     headers.set('cache-control', 'public, max-age=31536000'); // 1 year cache

//     return c.body(object.body, { headers });
//   } catch (error) {
//     console.error('Image serving error:', error);
//     return c.json({ error: 'Failed to serve image' }, 500);
//   }
// });

// // Video serving endpoint
// app.get('/api/videos/:filename{.+}', async (c) => {
//   try {
//     const filename = c.req.param('filename');
    
//     // Get the video from R2
//     const object = await c.env.R2_BUCKET.get(filename);
    
//     if (!object) {
//       return c.json({ error: 'Video not found' }, 404);
//     }

//     // Set appropriate headers for video streaming
//     const headers = new Headers();
//     object.writeHttpMetadata(headers);
//     headers.set('etag', object.httpEtag);
//     headers.set('accept-ranges', 'bytes');
    
//     // Support for range requests (important for video streaming)
//     const range = c.req.header('range');
//     if (range) {
//       const parts = range.replace(/bytes=/, '').split('-');
//       const start = parseInt(parts[0], 10);
//       const end = parts[1] ? parseInt(parts[1], 10) : object.size - 1;
//       const chunksize = (end - start) + 1;
      
//       headers.set('content-range', `bytes ${start}-${end}/${object.size}`);
//       headers.set('content-length', chunksize.toString());
      
//       // Get the range from R2
//       const rangeObject = await c.env.R2_BUCKET.get(filename, {
//         range: { offset: start, length: chunksize }
//       });
      
//       if (!rangeObject) {
//         return c.json({ error: 'Range not satisfiable' }, 416);
//       }
      
//       return c.body(rangeObject.body, { 
//         status: 206, // Partial Content
//         headers 
//       });
//     }

//     return c.body(object.body, { headers });
//   } catch (error) {
//     console.error('Video serving error:', error);
//     return c.json({ error: 'Failed to serve video' }, 500);
//   }
// });

// // Export endpoints for data
// app.get('/api/admin/export/venues', authMiddleware, adminMiddleware, async (c) => {
//   const { results } = await c.env.DB.prepare(
//     "SELECT * FROM venues ORDER BY created_at DESC"
//   ).all();

//   c.header('Content-Type', 'text/csv');
//   c.header('Content-Disposition', 'attachment; filename=venues.csv');

//   const csvHeaders = 'ID,Name,Description,Address,City,Phone,Email,Capacity,Created At\n';
//   const csvRows = results.map((venue: any) => 
//     `${venue.id},"${venue.name || ''}","${venue.description || ''}","${venue.address || ''}","${venue.city || ''}","${venue.phone || ''}","${venue.email || ''}",${venue.capacity || ''},${venue.created_at}`
//   ).join('\n');

//   return c.text(csvHeaders + csvRows);
// });

// app.get('/api/admin/export/events', authMiddleware, adminMiddleware, async (c) => {
//   const { results } = await c.env.DB.prepare(`
//     SELECT e.*, v.name as venue_name
//     FROM events e
//     JOIN venues v ON e.venue_id = v.id
//     ORDER BY e.created_at DESC
//   `).all();

//   c.header('Content-Type', 'text/csv');
//   c.header('Content-Disposition', 'attachment; filename=events.csv');

//   const csvHeaders = 'ID,Title,Description,Venue,Event Date,Start Time,End Time,Base Price,Max Capacity,Status,Created At\n';
//   const csvRows = results.map((event: any) => 
//     `${event.id},"${event.title || ''}","${event.description || ''}","${event.venue_name || ''}",${event.event_date},"${event.start_time || ''}","${event.end_time || ''}",${event.base_price || ''},${event.max_capacity || ''},${event.status},${event.created_at}`
//   ).join('\n');

//   return c.text(csvHeaders + csvRows);
// });

// app.get('/api/admin/export/bookings', authMiddleware, adminMiddleware, async (c) => {
//   const { results } = await c.env.DB.prepare(`
//     SELECT b.*, e.title as event_title, v.name as venue_name
//     FROM bookings b
//     JOIN events e ON b.event_id = e.id
//     JOIN venues v ON e.venue_id = v.id
//     ORDER BY b.created_at DESC
//   `).all();

//   c.header('Content-Type', 'text/csv');
//   c.header('Content-Disposition', 'attachment; filename=bookings.csv');

//   const csvHeaders = 'ID,Event,Venue,User ID,Guest Count,Total Amount,Booking Status,Payment Status,Reference,Created At\n';
//   const csvRows = results.map((booking: any) => 
//     `${booking.id},"${booking.event_title || ''}","${booking.venue_name || ''}",${booking.user_id},${booking.guest_count},${booking.total_amount || ''},${booking.booking_status},${booking.payment_status},"${booking.booking_reference || ''}",${booking.created_at}`
//   ).join('\n');

//   return c.text(csvHeaders + csvRows);
// });

// app.get('/api/admin/export/stories', authMiddleware, adminMiddleware, async (c) => {
//   const { results } = await c.env.DB.prepare(`
//     SELECT s.*, v.name as venue_name, e.title as event_title
//     FROM stories s
//     LEFT JOIN venues v ON s.venue_id = v.id
//     LEFT JOIN events e ON s.event_id = e.id
//     ORDER BY s.created_at DESC
//   `).all();

//   c.header('Content-Type', 'text/csv');
//   c.header('Content-Disposition', 'attachment; filename=stories.csv');

//   const csvHeaders = 'ID,Title,Story Type,Venue,Event,Published,Featured,Views,Likes,Shares,Created At\n';
//   const csvRows = results.map((story: any) => 
//     `${story.id},"${story.title || ''}",${story.story_type},"${story.venue_name || ''}","${story.event_title || ''}",${story.is_published ? 'Yes' : 'No'},${story.is_featured ? 'Yes' : 'No'},${story.view_count},${story.like_count},${story.share_count},${story.created_at}`
//   ).join('\n');

//   return c.text(csvHeaders + csvRows);
// });
// // 
// export default app;
