import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetric } from '@haut-spare/util/constants';
import { CardComponent } from '@haut-spare/shared-ui';

/**
 * Dashboard metrics display component
 * Shows metrics in a responsive grid layout
 */
@Component({
  selector: 'app-dashboard-metrics',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="metrics-grid">
      <div
        *ngFor="let metric of metrics; trackBy: trackByKey"
        class="metric-card"
      >
        <app-card>
          <div class="metric-content">
            <div class="metric-header">
              <h3 class="metric-title">{{ metric.name }}</h3>
              <span
                *ngIf="metric.trend"
                [ngClass]="'trend-badge ' + (metric.trend > 0 ? 'positive' : 'negative')"
              >
                {{ metric.trend > 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}%
              </span>
            </div>
            <div class="metric-body">
              <p class="metric-value">{{ metric.value }}</p>
              <p *ngIf="metric.description" class="metric-description">
                {{ metric.description }}
              </p>
            </div>
            <div *ngIf="metric.chartData" class="metric-chart">
              <div class="chart-placeholder">Chart: {{ metric.chartData }}</div>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [
    `
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        width: 100%;
      }

      .metric-card {
        display: flex;
      }

      .metric-content {
        width: 100%;
      }

      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .metric-title {
        font-size: 16px;
        font-weight: 600;
        color: #2d3748;
        margin: 0;
      }

      .trend-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;

        &.positive {
          background-color: #c6f6d5;
          color: #22543d;
        }

        &.negative {
          background-color: #fed7d7;
          color: #742a2a;
        }
      }

      .metric-body {
        display: flex;
        flex-direction: column;
      }

      .metric-value {
        font-size: 28px;
        font-weight: 700;
        color: #1a202c;
        margin: 8px 0;
      }

      .metric-description {
        font-size: 12px;
        color: #718096;
        margin: 0;
      }

      .metric-chart {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #e2e8f0;
      }

      .chart-placeholder {
        height: 60px;
        background: linear-gradient(90deg, #edf2f7 25%, #e2e8f0 50%, #edf2f7 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #718096;
      }

      @keyframes loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      @media (max-width: 768px) {
        .metrics-grid {
          grid-template-columns: 1fr;
        }

        .metric-value {
          font-size: 24px;
        }
      }
    `,
  ],
})
export class DashboardMetricsComponent {
  @Input() metrics: DashboardMetric[] | null = [];

  Math = Math;

  trackByKey(index: number, metric: DashboardMetric): string {
    return metric.name;
  }
}
