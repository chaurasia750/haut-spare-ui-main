import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '@haut-spare/data-access-api';
import { Transaction } from '@haut-spare/util-constants';
import { TableComponent, TableColumn, SelectComponent, SelectOption, LoadingSpinnerComponent } from '@haut-spare/shared-ui';
import { formatDate } from '@haut-spare/util-helpers';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, SelectComponent, LoadingSpinnerComponent],
  template: `
    <div class="history-container">
      <div class="history-header">
        <h1>Transaction History</h1>
        <p class="subtitle">View and filter all your transactions</p>
      </div>

      <div class="filters-section">
        <app-select
          [options]="typeOptions"
          [(ngModel)]="filterType"
          (selectionChange)="onTypeChange($event)"
          placeholder="All Types"
        ></app-select>

        <app-select
          [options]="statusOptions"
          [(ngModel)]="filterStatus"
          (selectionChange)="onStatusChange($event)"
          placeholder="All Status"
        ></app-select>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <app-loading-spinner message="Loading transaction history..."></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading && error" class="error-message">
        {{ error }}
      </div>

      <app-table
        *ngIf="!isLoading && !error"
        [columns]="columns"
        [data]="filteredTransactions"
        [pagination]="true"
        [pageSize]="10"
        emptyMessage="No transactions found"
      ></app-table>
    </div>
  `,
  styles: [
    `
      .history-container {
        padding: 24px;
      }

      .history-header {
        margin-bottom: 32px;
      }

      .history-header h1 {
        font-size: 28px;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
      }

      .subtitle {
        color: #718096;
        margin: 8px 0 0 0;
        font-size: 14px;
      }

      .filters-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
        padding: 16px;
        background-color: #f7fafc;
        border-radius: 8px;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .error-message {
        background-color: #fed7d7;
        color: #742a2a;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class HistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  isLoading = false;
  error: string | null = null;

  filterType: string = '';
  filterStatus: string = '';

  columns: TableColumn[] = [
    { key: 'createdAt', label: 'Date', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  typeOptions: SelectOption[] = [
    { label: 'All Types', value: '' },
    { label: 'Credit', value: 'credit' },
    { label: 'Debit', value: 'debit' },
  ];

  statusOptions: SelectOption[] = [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
  ];

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.error = null;

    this.walletService.getTransactions().subscribe(
      (response) => {
        this.transactions = response.data || response;
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        this.error = error?.message || 'Failed to load transaction history';
        this.isLoading = false;
      }
    );
  }

  onTypeChange(option: SelectOption): void {
    this.filterType = option.value;
    this.applyFilters();
  }

  onStatusChange(option: SelectOption): void {
    this.filterStatus = option.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter((tx) => {
      let matchType = true;
      let matchStatus = true;

      if (this.filterType) {
        matchType = tx.type === this.filterType;
      }

      if (this.filterStatus) {
        matchStatus = tx.status === this.filterStatus;
      }

      return matchType && matchStatus;
    });
  }

  formatDate(date: string): string {
    return formatDate(date);
  }
}
            <td>{{ tx.description }}</td>
            <td [ngClass]="'type-' + tx.type">{{ tx.type }}</td>
            <td [ngClass]="'amount-' + tx.type">
              {{ tx.type === 'credit' ? '+' : '-' }}{{ tx.amount | number : '1.2-2' }}
            </td>
            <td [ngClass]="'status-' + tx.status">{{ tx.status }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && filteredTransactions.length === 0" class="empty-state">
        <p>No transactions found</p>
      </div>
    </div>
  `,
  styles: [
    `
      .history-container {
        padding: 20px;
      }

      .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .filters {
        display: flex;
        gap: 10px;
      }

      .filters select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .history-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      .history-table th,
      .history-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      .history-table th {
        background-color: #f8f9fa;
        font-weight: 600;
      }

      .type-credit {
        color: #28a745;
      }

      .type-debit {
        color: #dc3545;
      }

      .amount-credit {
        color: #28a745;
        font-weight: 600;
      }

      .amount-debit {
        color: #dc3545;
        font-weight: 600;
      }

      .status-pending {
        color: #ffc107;
      }

      .status-completed {
        color: #28a745;
      }

      .status-failed {
        color: #dc3545;
      }

      .loading,
      .error-message {
        padding: 20px;
        text-align: center;
      }

      .error-message {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
      }

      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #999;
      }
    `,
  ],
})
export class HistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  loading = false;
  error: string | null = null;
  filterType = '';
  filterStatus = '';

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.error = null;

    this.walletService.getTransactions().subscribe({
      next: (response) => {
        this.transactions = response.data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transaction history';
        this.loading = false;
        console.error(err);
      },
    });
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter((tx) => {
      const typeMatch = !this.filterType || tx.type === this.filterType;
      const statusMatch = !this.filterStatus || tx.status === this.filterStatus;
      return typeMatch && statusMatch;
    });
  }
}
