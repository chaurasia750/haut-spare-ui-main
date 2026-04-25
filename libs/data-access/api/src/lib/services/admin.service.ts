import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { DashboardMetric, Report, PaginatedResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpService) {}

  /**
   * Get dashboard metrics
   */
  getDashboardMetrics(): Observable<DashboardMetric[]> {
    return this.http.get<DashboardMetric[]>('/dashboard/metrics');
  }

  /**
   * Get all reports with optional filters
   */
  getReports(filters?: any): Observable<PaginatedResponse<Report>> {
    return this.http.get<PaginatedResponse<Report>>('/reports', { params: filters });
  }

  /**
   * Get report by ID
   */
  getReportById(id: string): Observable<Report> {
    return this.http.get<Report>(`/reports/${id}`);
  }

  /**
   * Generate new report
   */
  generateReport(title: string, filters: any): Observable<Report> {
    return this.http.post<Report>('/reports/generate', { title, filters });
  }

  /**
   * Export report
   */
  exportReport(id: string, format: string): Observable<Blob> {
    return this.http.get<Blob>(`/reports/${id}/export`, { params: { format } });
  }
}
