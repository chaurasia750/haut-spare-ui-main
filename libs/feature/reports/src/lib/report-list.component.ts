import { Component, OnInit, Input, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Report } from '@haut-spare/util/constants';
import { TableComponent, ButtonComponent, LoadingSpinnerComponent, CardComponent } from '@haut-spare/shared-ui';
import { ReportService, ReportFilter } from './report.service';

/**
 * Reusable report list component
 * Used by Admin remote for displaying reports
 * Expects a ReportService provider in the component hierarchy
 */
@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    LoadingSpinnerComponent,
    CardComponent,
  ],
  template: `
    <div class="report-container">
      <div class="report-header">
        <h1 class="report-title">{{ title }}</h1>
        <p class="report-subtitle">{{ subtitle }}</p>
        <app-button
          variant="primary"
          (click)="onGenerateReport()"
          *ngIf="allowGenerate"
        >
          Generate Report
        </app-button>
      </div>

      <app-loading-spinner
        *ngIf="loading$ | async"
        message="Loading reports..."
      ></app-loading-spinner>

      <div *ngIf="!(loading$ | async)" class="report-content">
        <app-table
          [data]="reports$ | async"
          [columns]="tableColumns"
          (rowClick)="onRowClick($event)"
          [sortable]="true"
          [pagination]="true"
          pageSize="10"
        ></app-table>
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
  `,
  styles: [
    `
      .report-container {
        width: 100%;
        padding: 24px;
        background: #f5f7fa;
        min-height: 100vh;
      }

      .report-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 32px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .report-title {
        font-size: 28px;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
      }

      .report-subtitle {
        font-size: 16px;
        color: #718096;
        margin: 8px 0 0 0;
        width: 100%;
      }

      .report-content {
        width: 100%;
        background: white;
        border-radius: 8px;
        padding: 20px;
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
        .report-container {
          padding: 16px;
        }

        .report-header {
          flex-direction: column;
        }

        .report-title {
          font-size: 24px;
        }

        .report-content {
          padding: 12px;
        }

        .error-content {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ReportListComponent implements OnInit {
  @Input() title: string = 'Reports';
  @Input() subtitle: string = 'View and manage your reports';
  @Input() allowGenerate: boolean = false;

  reports$: Observable<Report[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  tableColumns = [
    { key: 'name', label: 'Report Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  private reportService: ReportService;

  constructor(private injector: Injector) {
    this.reportService = this.injector.get(ReportService);
    this.reports$ = this.reportService.getReports();
    this.loading$ = this.reportService.isLoading();
    this.error$ = this.reportService.getError();
  }

  ngOnInit(): void {
    this.reportService.loadReports();
  }

  onRowClick(report: Report): void {
    // Navigate to report detail page
    console.log('Report clicked:', report);
  }

  onGenerateReport(): void {
    console.log('Generate report clicked');
    // Trigger report generation logic
  }

  onRetry(): void {
    this.reportService.refresh();
  }
}
