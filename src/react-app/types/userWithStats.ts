export type UserWithStats = {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  isActive: boolean;
  createdAt: string;
  stats: {
    total_bookings: number;
    total_spent: number;
    events_created?: number;
  };
  walletId?: {
    balance: number;
  };
};