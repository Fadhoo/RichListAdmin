
CREATE TABLE stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  story_type TEXT NOT NULL DEFAULT 'general',
  venue_id INTEGER,
  event_id INTEGER,
  author_id TEXT,
  media_url TEXT,
  media_type TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT 0,
  is_featured BOOLEAN DEFAULT 0,
  publish_date DATETIME,
  expires_at DATETIME,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  tags TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stories_venue_id ON stories(venue_id);
CREATE INDEX idx_stories_event_id ON stories(event_id);
CREATE INDEX idx_stories_author_id ON stories(author_id);
CREATE INDEX idx_stories_story_type ON stories(story_type);
CREATE INDEX idx_stories_is_published ON stories(is_published);
CREATE INDEX idx_stories_publish_date ON stories(publish_date);

CREATE TABLE story_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  story_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_story_interactions_story_id ON story_interactions(story_id);
CREATE INDEX idx_story_interactions_user_id ON story_interactions(user_id);
CREATE INDEX idx_story_interactions_type ON story_interactions(interaction_type);
