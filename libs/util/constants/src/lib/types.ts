/**
 * Domain Models and Types
 */

/**
 * User type for authentication
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'superadmin';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

/**
 * Admin user extending base User
 */
export interface AdminUser extends User {
  role: 'admin' | 'superadmin';
  permissions: string[];
  departmentId?: string;
}

/**
 * Member user extending base User
 */
export interface MemberUser extends User {
  role: 'member';
  memberId: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: string;
}

/**
 * Member Profile information
 */
export interface MemberProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Wallet information
 */
export interface Wallet {
  id: string;
  memberId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

/**
 * Wallet Balance
 */
export interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

/**
 * Transaction type
 */
export interface Transaction {
  id: string;
  memberId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dashboard Metric
 */
export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercentage?: number;
  icon?: string;
}

/**
 * Report type
 */
export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'users' | 'revenue' | 'engagement';
  generatedAt: string;
  generatedBy: string;
  data: any;
  fileUrl?: string;
  status: 'generated' | 'pending' | 'failed';
}

/**
 * Paginated Response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API Error Response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * Authentication Token
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Create User Request
 */
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'member';
}

/**
 * Update User Request
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
  isActive?: boolean;
}

/**
 * Filter options for queries
 */
export interface FilterOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

/**
 * Table column configuration
 */
export interface ColumnConfig {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  formatter?: (value: any) => string;
}

/**
 * Navigation link
 */
export interface NavLink {
  label: string;
  path: string;
  icon?: string;
  children?: NavLink[];
}
