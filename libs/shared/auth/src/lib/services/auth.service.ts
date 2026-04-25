import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { TokenService, User, LoginRequest, AuthToken } from './token.service';
import { HttpService } from '@haut-spare/data-access-api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.tokenService.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.tokenService.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private tokenService: TokenService,
    private httpService: HttpService
  ) {}

  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<AuthToken> {
    return this.httpService.post<AuthToken>('/auth/login', credentials).pipe(
      tap((response) => {
        this.tokenService.setAccessToken(response.accessToken);
        if (response.refreshToken) {
          this.tokenService.setRefreshToken(response.refreshToken);
        }
        // Fetch current user after successful login
        this.getCurrentUserData().subscribe();
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<AuthToken> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.httpService
      .post<AuthToken>('/auth/refresh', { refreshToken })
      .pipe(
        tap((response) => {
          this.tokenService.setAccessToken(response.accessToken);
          if (response.refreshToken) {
            this.tokenService.setRefreshToken(response.refreshToken);
          }
        })
      );
  }

  /**
   * Get current user data from server
   */
  getCurrentUserData(): Observable<User> {
    return this.httpService.get<User>('/auth/me').pipe(
      tap((user) => {
        this.tokenService.setCurrentUser(user);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Get current user from memory
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }
}
