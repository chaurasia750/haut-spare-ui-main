import { Component, OnInit, Input, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardMetric } from '@haut-spare/util/constants';
import { CardComponent, LoadingSpinnerComponent } from '@haut-spare/shared-ui';
import { DashboardService } from './dashboard.service';
import { DashboardMetricsComponent } from './dashboard-metrics/metrics.component';

/**
 * Reusable dashboard container component
 * Can be used by both Admin and Member remotes
 * Expects a DashboardService provider in the component hierarchy
 */
@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    LoadingSpinnerComponent,
    DashboardMetricsComponent,
  ],
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
})
export class DashboardContainerComponent implements OnInit {
  @Input() title: string = 'Dashboard';
  @Input() subtitle: string = 'Welcome back! Here is your dashboard overview.';

  metrics$: Observable<DashboardMetric[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private dashboardService: DashboardService;

  constructor(private injector: Injector) {
    this.dashboardService = this.injector.get(DashboardService);
    this.metrics$ = this.dashboardService.getMetrics();
    this.loading$ = this.dashboardService.isLoading();
    this.error$ = this.dashboardService.getError();
  }

  ngOnInit(): void {
    this.dashboardService.loadMetrics();
  }

  onRetry(): void {
    this.dashboardService.refresh();
  }
}
