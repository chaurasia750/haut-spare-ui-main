import { User, CreateUserRequest } from './api.model';

/**
 * Extended User model for admin operations
 */
export interface AdminUser extends User {
  permissions: string[];
  departmentId?: string;
  lastLogin?: string;
}

/**
 * Admin dashboard filter
 */
export interface AdminFilter {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * User creation request with additional admin fields
 */
export interface AdminCreateUserRequest extends CreateUserRequest {
  departmentId?: string;
  permissions?: string[];
}

/**
 * User update request
 */
export interface AdminUpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  departmentId?: string;
  permissions?: string[];
  isActive?: boolean;
}

/**
 * Admin statistics
 */
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: { [key: string]: number };
}

/**
 * User management response
 */
export interface UserManagementResponse {
  users: AdminUser[];
  stats: AdminStats;
  filters: AdminFilter;
}
