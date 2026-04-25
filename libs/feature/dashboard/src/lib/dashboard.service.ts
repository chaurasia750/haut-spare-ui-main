import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DashboardMetric } from '@haut-spare/util/constants';

/**
 * Generic dashboard service interface for loading and managing dashboard metrics
 * Can be extended by admin or member specific services
 */
@Injectable()
export class DashboardService {
  protected metricsSubject = new BehaviorSubject<DashboardMetric[]>([]);
  public metrics$ = this.metricsSubject.asObservable();

  protected loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  protected errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {}

  /**
   * Load dashboard metrics
   * Can be overridden by subclasses for specific implementations
   */
  loadMetrics(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Placeholder implementation - override in subclasses
    this.metricsSubject.next([]);
    this.loadingSubject.next(false);
  }

  /**
   * Get current metrics
   */
  getMetrics(): Observable<DashboardMetric[]> {
    return this.metrics$;
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
   * Set metrics
   */
  protected setMetrics(metrics: DashboardMetric[]): void {
    this.metricsSubject.next(metrics);
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
   * Refresh metrics
   */
  refresh(): void {
    this.loadMetrics();
  }

  /**
   * Clear state
   */
  clear(): void {
    this.metricsSubject.next([]);
    this.errorSubject.next(null);
    this.loadingSubject.next(false);
  }
}
