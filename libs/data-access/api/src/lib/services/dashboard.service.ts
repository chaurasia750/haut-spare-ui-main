import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { DashboardMetric } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpService) {}

  /**
   * Get dashboard metrics
   */
  getMetrics(): Observable<DashboardMetric[]> {
    return this.http.get<DashboardMetric[]>('/dashboard/metrics');
  }

  /**
   * Get dashboard summary
   */
  getSummary(): Observable<any> {
    return this.http.get<any>('/dashboard/summary');
  }
}
