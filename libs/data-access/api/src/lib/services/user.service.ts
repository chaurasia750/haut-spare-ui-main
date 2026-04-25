import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { User, CreateUserRequest, PaginatedResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpService) {}

  /**
   * Get all users with optional filters
   */
  getUsers(filters?: any): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>('/users', { params: filters });
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`/users/${id}`);
  }

  /**
   * Create new user
   */
  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>('/users', user);
  }

  /**
   * Update existing user
   */
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`/users/${id}`, user);
  }

  /**
   * Delete user
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`/users/${id}`);
  }
}
