import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly tokenKey = 'auth_token';
  private readonly refreshTokenKey = 'refresh_token';
  private readonly userKey = 'current_user';

  /**
   * Save access token to localStorage
   */
  setAccessToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Save refresh token to localStorage
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Save current user to localStorage
   */
  setCurrentUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Clear all tokens and user data
   */
  clear(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  }
}
