import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RemoteLoadingState {
  isLoading: boolean;
  remoteName?: string;
  error?: string;
  startTime?: number;
  endTime?: number;
}

/**
 * Service to manage remote module loading state
 * Tracks loading progress, errors, and retry logic for lazy-loaded remotes
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteLoadingService {
  private loadingStateSubject = new BehaviorSubject<RemoteLoadingState>({
    isLoading: false,
  });

  public loadingState$ = this.loadingStateSubject.asObservable();

  constructor() {}

  /**
   * Get current loading state
   */
  getLoadingState(): RemoteLoadingState {
    return this.loadingStateSubject.value;
  }

  /**
   * Start loading a remote
   */
  startLoading(remoteName: string): void {
    this.loadingStateSubject.next({
      isLoading: true,
      remoteName,
      startTime: Date.now(),
    });
  }

  /**
   * Finish loading a remote
   */
  finishLoading(remoteName: string): void {
    const currentState = this.loadingStateSubject.value;
    this.loadingStateSubject.next({
      isLoading: false,
      remoteName,
      endTime: Date.now(),
      startTime: currentState.startTime,
    });
  }

  /**
   * Set loading error
   */
  setError(remoteName: string, error: string): void {
    this.loadingStateSubject.next({
      isLoading: false,
      remoteName,
      error,
      endTime: Date.now(),
    });
  }

  /**
   * Get loading time in milliseconds
   */
  getLoadingTime(): number | undefined {
    const state = this.loadingStateSubject.value;
    if (state.startTime && state.endTime) {
      return state.endTime - state.startTime;
    }
    return undefined;
  }

  /**
   * Check if a remote is currently loading
   */
  isLoading(): Observable<boolean> {
    return new Observable((subscriber) => {
      subscriber.next(this.loadingStateSubject.value.isLoading);
      this.loadingState$.subscribe((state) => subscriber.next(state.isLoading));
    });
  }

  /**
   * Get current remote name
   */
  getCurrentRemote(): string | undefined {
    return this.loadingStateSubject.value.remoteName;
  }

  /**
   * Get error message if any
   */
  getError(): string | undefined {
    return this.loadingStateSubject.value.error;
  }

  /**
   * Clear state
   */
  clear(): void {
    this.loadingStateSubject.next({
      isLoading: false,
    });
  }
}
