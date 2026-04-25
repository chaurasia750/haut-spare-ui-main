import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th *ngFor="let col of columns" [style.width]="col.width" class="table-header">
              <button
                *ngIf="col.sortable"
                class="sort-button"
                (click)="onSort(col.key)"
                [class.active]="sortColumn === col.key"
              >
                {{ col.label }}
                <span class="sort-indicator" *ngIf="sortColumn === col.key">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </button>
              <span *ngIf="!col.sortable">{{ col.label }}</span>
            </th>
            <th *ngIf="hasActions" class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index" class="table-row">
            <td *ngFor="let col of columns" class="table-cell">
              {{ row[col.key] }}
            </td>
            <td *ngIf="hasActions" class="table-cell actions-cell">
              <button
                *ngIf="onEdit"
                class="action-btn edit"
                (click)="onEdit(row)"
                title="Edit"
              >
                ✏️
              </button>
              <button
                *ngIf="onDelete"
                class="action-btn delete"
                (click)="onDelete(row)"
                title="Delete"
              >
                🗑️
              </button>
            </td>
          </tr>
          <tr *ngIf="data.length === 0" class="table-row empty">
            <td [attr.colspan]="columns.length + (hasActions ? 1 : 0)" class="table-cell">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="pagination" class="pagination">
        <button
          class="btn-pagination"
          (click)="previousPage()"
          [disabled]="currentPage === 1"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          class="btn-pagination"
          (click)="nextPage()"
          [disabled]="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .table-wrapper {
        width: 100%;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
      }

      .table-header {
        background-color: #f7fafc;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        color: #4a5568;
        border-bottom: 2px solid #e2e8f0;
      }

      .sort-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #4a5568;
        font-weight: 600;
        font-size: 12px;
        padding: 0;
        display: flex;
        align-items: center;
        gap: 6px;

        &.active {
          color: #3182ce;
        }

        &:hover {
          color: #2d3748;
        }
      }

      .sort-indicator {
        font-size: 10px;
      }

      .table-row {
        border-bottom: 1px solid #e2e8f0;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f7fafc;
        }

        &.empty {
          &:hover {
            background-color: white;
          }
        }
      }

      .table-cell {
        padding: 12px;
        font-size: 14px;
        color: #2d3748;
      }

      .actions-cell {
        display: flex;
        gap: 8px;
      }

      .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
          background-color: #e2e8f0;
        }

        &.delete:hover {
          background-color: #fed7d7;
        }
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-top: 16px;
        padding: 12px;
      }

      .btn-pagination {
        padding: 8px 16px;
        border: 1px solid #cbd5e0;
        background-color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background-color: #edf2f7;
          border-color: #a0aec0;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .page-info {
        font-size: 14px;
        color: #4a5568;
        min-width: 100px;
        text-align: center;
      }
    `,
  ],
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() pagination: boolean = false;
  @Input() pageSize: number = 10;
  @Input() emptyMessage: string = 'No data available';

  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowEdit = new EventEmitter<any>();
  @Output() rowDelete = new EventEmitter<any>();

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  totalPages: number = 1;

  onEdit: ((row: any) => void) | null = null;
  onDelete: ((row: any) => void) | null = null;

  get hasActions(): boolean {
    return !!this.onEdit || !!this.onDelete;
  }

  ngOnInit(): void {
    this.onEdit = (row) => this.rowEdit.emit(row);
    this.onDelete = (row) => this.rowDelete.emit(row);
    this.calculatePagination();
  }

  ngOnChanges(): void {
    this.calculatePagination();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ column: this.sortColumn, direction: this.sortDirection });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  private calculatePagination(): void {
    if (this.pagination) {
      this.totalPages = Math.ceil(this.data.length / this.pageSize);
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }
    }
  }
}
