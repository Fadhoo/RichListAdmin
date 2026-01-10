export interface ConciergeProvider {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone?: string;
  description?: string;
  services?: string[];
  isActive?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}
