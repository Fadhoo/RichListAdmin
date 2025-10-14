
-- Add user roles table for better role management
CREATE TABLE user_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  role_type TEXT NOT NULL DEFAULT 'user',
  permissions TEXT,
  assigned_by TEXT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user invitations table
CREATE TABLE user_invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  invited_by TEXT NOT NULL,
  role_type TEXT DEFAULT 'user',
  subscription_plan TEXT DEFAULT 'basic',
  invitation_token TEXT,
  status TEXT DEFAULT 'pending',
  expires_at DATETIME,
  accepted_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add payment records table for better financial tracking
CREATE TABLE payment_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  subscription_id INTEGER,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'NGN',
  payment_method TEXT,
  payment_provider TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  payment_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add subscription change log for audit trail
CREATE TABLE subscription_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  old_plan_type TEXT,
  new_plan_type TEXT,
  changed_by TEXT,
  reason TEXT,
  effective_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user preferences table
CREATE TABLE user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT 1,
  sms_notifications BOOLEAN DEFAULT 0,
  marketing_emails BOOLEAN DEFAULT 1,
  event_reminders BOOLEAN DEFAULT 1,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Africa/Lagos',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_invitations_email ON user_invitations(email);
CREATE INDEX idx_user_invitations_status ON user_invitations(status);
CREATE INDEX idx_payment_records_user_id ON payment_records(user_id);
CREATE INDEX idx_payment_records_status ON payment_records(status);
CREATE INDEX idx_subscription_changes_user_id ON subscription_changes(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Add some constraints and improve existing schema
ALTER TABLE user_subscriptions ADD COLUMN auto_renew BOOLEAN DEFAULT 1;
ALTER TABLE user_subscriptions ADD COLUMN cancelled_at DATETIME;
ALTER TABLE user_subscriptions ADD COLUMN cancellation_reason TEXT;
