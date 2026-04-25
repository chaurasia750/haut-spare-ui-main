import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Report } from '@haut-spare/util/constants';

export interface ReportFilter {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

/**
 * Generic report service for managing reports
 * Can be extended for admin or member specific reports
 */
@Injectable()
export class ReportService {
  protected reportsSubject = new BehaviorSubject<Report[]>([]);
  public reports$ = this.reportsSubject.asObservable();

  protected loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  protected errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {}

  /**
   * Load reports
   * Can be overridden by subclasses for specific implementations
   */
  loadReports(filters?: ReportFilter): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Placeholder implementation - override in subclasses
    this.reportsSubject.next([]);
    this.loadingSubject.next(false);
  }

  /**
   * Get current reports
   */
  getReports(): Observable<Report[]> {
    return this.reports$;
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
   * Get report by ID
   */
  getReportById(id: string): Observable<Report | undefined> {
    return new Observable((subscriber) => {
      this.reports$.subscribe((reports) => {
        const report = reports.find((r) => r.id === id);
        subscriber.next(report);
        subscriber.complete();
      });
    });
  }

  /**
   * Set reports
   */
  protected setReports(reports: Report[]): void {
    this.reportsSubject.next(reports);
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
   * Refresh reports
   */
  refresh(filters?: ReportFilter): void {
    this.loadReports(filters);
  }

  /**
   * Clear state
   */
  clear(): void {
    this.reportsSubject.next([]);
    this.errorSubject.next(null);
    this.loadingSubject.next(false);
  }
}
