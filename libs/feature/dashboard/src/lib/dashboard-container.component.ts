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
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">{{ title }}</h1>
        <p class="dashboard-subtitle">{{ subtitle }}</p>
      </div>

      <div class="dashboard-content">
        <app-loading-spinner
          *ngIf="loading$ | async"
          message="Loading dashboard..."
        ></app-loading-spinner>

        <div *ngIf="!(loading$ | async)" class="metrics-section">
          <app-dashboard-metrics
            [metrics]="metrics$ | async"
          ></app-dashboard-metrics>
        </div>

        <div
          *ngIf="(error$ | async) as error"
          class="error-section"
        >
          <app-card variant="error">
            <div class="error-content">
              <p class="error-message">{{ error }}</p>
              <button
                class="retry-button"
                (click)="onRetry()"
              >
                Retry
              </button>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        width: 100%;
        padding: 24px;
        background: #f5f7fa;
        min-height: 100vh;
      }

      .dashboard-header {
        margin-bottom: 32px;
      }

      .dashboard-title {
        font-size: 28px;
        font-weight: 700;
        color: #1a202c;
        margin: 0 0 8px 0;
      }

      .dashboard-subtitle {
        font-size: 16px;
        color: #718096;
        margin: 0;
      }

      .dashboard-content {
        width: 100%;
      }

      .metrics-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }

      .error-section {
        margin-top: 20px;
      }

      .error-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .error-message {
        flex: 1;
        margin: 0;
        color: #742a2a;
      }

      .retry-button {
        padding: 8px 16px;
        background-color: #e53e3e;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;

        &:hover {
          background-color: #c53030;
        }
      }

      @media (max-width: 768px) {
        .dashboard-container {
          padding: 16px;
        }

        .dashboard-title {
          font-size: 24px;
        }

        .dashboard-subtitle {
          font-size: 14px;
        }

        .metrics-section {
          grid-template-columns: 1fr;
        }

        .error-content {
          flex-direction: column;
        }
      }
    `,
  ],
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
