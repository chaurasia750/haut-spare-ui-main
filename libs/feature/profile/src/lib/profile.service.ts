import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MemberProfile } from '@haut-spare/util/constants';

/**
 * Generic profile service for managing member profiles
 * Can be extended for specific profile implementations
 */
@Injectable()
export class ProfileService {
  protected profileSubject = new BehaviorSubject<MemberProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  protected loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  protected errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {}

  /**
   * Load profile
   * Can be overridden by subclasses for specific implementations
   */
  loadProfile(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Placeholder implementation - override in subclasses
    this.profileSubject.next(null);
    this.loadingSubject.next(false);
  }

  /**
   * Get current profile
   */
  getProfile(): Observable<MemberProfile | null> {
    return this.profile$;
  }

  /**
   * Get loading state
   */
  isLoading(): Observable<boolean> {
    return this.loading$;
  }

  /**
   * Get error state
   */
  getError(): Observable<string | null> {
    return this.error$;
  }

  /**
   * Update profile
   */
  updateProfile(profile: Partial<MemberProfile>): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Placeholder implementation - override in subclasses
    const current = this.profileSubject.value;
    if (current) {
      this.profileSubject.next({ ...current, ...profile });
    }
    this.loadingSubject.next(false);
  }

  /**
   * Set profile
   */
  protected setProfile(profile: MemberProfile | null): void {
    this.profileSubject.next(profile);
  }

  /**
   * Set loading state
   */
  protected setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Set error
   */
  protected setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  /**
   * Refresh profile
   */
  refresh(): void {
    this.loadProfile();
  }

  /**
   * Clear state
   */
  clear(): void {
    this.profileSubject.next(null);
    this.errorSubject.next(null);
    this.loadingSubject.next(false);
  }
}
