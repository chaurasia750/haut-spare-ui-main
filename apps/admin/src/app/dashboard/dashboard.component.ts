import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, LoadingSpinnerComponent } from '@haut-spare/shared-ui';
import { DashboardService } from '@haut-spare/data-access-api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, LoadingSpinnerComponent],
  template: `
    <div class="dashboard">
      <div class="header">
        <h1>Dashboard</h1>
        <p class="subtitle">Admin Overview & Key Metrics</p>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <app-loading-spinner message="Loading dashboard metrics..."></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading" class="metrics-grid">
        <app-card *ngFor="let metric of metrics" [title]="metric.label">
          <div class="metric-content">
            <div class="metric-value">{{ metric.value }}</div>
            <div *ngIf="metric.trend" class="metric-trend" [class]="metric.trend">
              {{ metric.trend === 'up' ? '↑' : '↓' }} {{ metric.trendPercentage }}%
            </div>
          </div>
        </app-card>
      </div>

      <div *ngIf="!isLoading && metrics.length === 0" class="no-data">
        <p>No metrics available</p>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 24px;
      }

      .header {
        margin-bottom: 32px;
      }

      .header h1 {
        font-size: 32px;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
      }

      .subtitle {
        color: #718096;
        margin: 8px 0 0 0;
        font-size: 14px;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
      }

      .metric-content {
        padding: 16px 0;
      }

      .metric-value {
        font-size: 32px;
        font-weight: 700;
        color: #3182ce;
        margin-bottom: 8px;
      }

      .metric-trend {
        font-size: 14px;
        font-weight: 500;

        &.up {
          color: #22863a;
        }

        &.down {
          color: #cb2431;
        }
      }

      .no-data {
        text-align: center;
        padding: 40px;
        color: #718096;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  metrics: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  private loadMetrics(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardMetrics().subscribe(
      (metrics) => {
        this.metrics = metrics;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
      }

      .metric-label {
        font-size: 14px;
        color: #666;
        margin-top: 8px;
      }
    `,
  ],
})
export class DashboardComponent {}
