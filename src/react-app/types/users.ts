export type User = {
  status: string;
  role: string;
  isEmailVerified: boolean;
  name: string;
  mobile: string;
  email: string;
  dateOfBirth: Date;
  nationality: string;
  picture: string;
  createdAt: string;
  last_login: string;
  isActive: boolean;
  stats: {
    total_bookings?: number;
    total_spent?: number;
    events_created?: number;
  };
  id: string;
  shopId?: string;
  ownerId?: string;
};

export type EditUserBody = {
  name: string;
  mobile: string;
  nationality: string;
  role: string;
  dateOfBirth: Date;
};

export type Staff = {
  id: string;
  name: string;
  role: string;
  nationality: string;
  mobile: string;
  email: string;
  shopId: string;
  availableDays: string[];
  status: string;
  isEmailVerified: false;
  ownerId: string | Owner;
};

export type CreateStaffBody = {
  name: string;
  role: string;
  nationality: string;
  email: string;
  mobile: string;
  password?: string;
  shopId: string;
  availableDays: string[];
};

export type EditStaffBody = {
  name: string;
  nationality: string;
  mobile: string;
  availableDays: string[];
};

export type CreateStaffSchedule = {
  staff: string | Staff;
  shiftDate: string; //Date;
  startTime: string;
  endTime: string;
  role: string;
  notes: string;
  status: string;
  shopId?: string;
};

export type StaffSchedule = CreateStaffSchedule & {
  id: string;
};

export type Owner = {
  availableDays: string[];
  status: string;
  role: string;
  isEmailVerified: boolean;
  name: string;
  mobile: string;
  dateOfBirth: Date;
  email: string;
  id: string;
};
