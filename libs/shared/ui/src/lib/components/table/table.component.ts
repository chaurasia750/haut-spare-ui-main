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
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
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
