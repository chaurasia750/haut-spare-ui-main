export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  role: string;
  password: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  generatedBy: string;
  data: any;
}

export interface MemberProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletBalance {
  id: string;
  memberId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  referenceId?: string;
}
