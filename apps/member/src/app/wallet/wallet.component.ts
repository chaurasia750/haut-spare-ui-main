import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '@haut-spare/data-access-api';
import { Transaction, WalletBalance } from '@haut-spare/util-constants';
import { CardComponent, TableComponent, TableColumn, LoadingSpinnerComponent } from '@haut-spare/shared-ui';
import { formatCurrency, formatDate } from '@haut-spare/util-helpers';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, CardComponent, TableComponent, LoadingSpinnerComponent],
  template: `
    <div class="wallet-container">
      <div class="wallet-header">
        <h1>Wallet</h1>
        <p class="subtitle">Manage your wallet and transactions</p>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <app-loading-spinner message="Loading wallet information..."></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading && balance" class="balance-section">
        <app-card title="Current Balance">
          <div class="balance-content">
            <div class="balance-value">{{ formatCurrency(balance.balance) }}</div>
            <div class="balance-currency">{{ balance.currency }}</div>
            <div class="balance-updated">Last Updated: {{ formatDate(balance.lastUpdated) }}</div>
          </div>
        </app-card>
      </div>

      <div *ngIf="!isLoading && transactions.length > 0" class="transactions-section">
        <app-card title="Transaction History">
          <app-table
            [columns]="columns"
            [data]="transactions"
            [pagination]="true"
            [pageSize]="10"
            emptyMessage="No transactions found"
          ></app-table>
        </app-card>
      </div>

      <div *ngIf="!isLoading && transactions.length === 0" class="empty-state">
        <p>No transactions available</p>
      </div>

      <div *ngIf="!isLoading && error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [
    `
      .wallet-container {
        padding: 24px;
      }

      .wallet-header {
        margin-bottom: 32px;
      }

      .wallet-header h1 {
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

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .balance-section {
        margin-bottom: 32px;
      }

      .balance-content {
        padding: 20px 0;
        text-align: center;
      }

      .balance-value {
        font-size: 36px;
        font-weight: 700;
        color: #3182ce;
        margin-bottom: 8px;
      }

      .balance-currency {
        font-size: 14px;
        color: #718096;
        margin-bottom: 8px;
      }

      .balance-updated {
        font-size: 12px;
        color: #a0aec0;
      }

      .transactions-section {
        margin-bottom: 24px;
      }

      .empty-state {
        text-align: center;
        padding: 40px;
        color: #718096;
        background-color: #f7fafc;
        border-radius: 8px;
      }

      .error-message {
        background-color: #fed7d7;
        color: #742a2a;
        padding: 16px;
        border-radius: 8px;
        margin-top: 16px;
      }
    `,
  ],
})
export class WalletComponent implements OnInit {
  balance: WalletBalance | null = null;
  transactions: Transaction[] = [];
  isLoading = false;
  error: string | null = null;
  columns: TableColumn[] = [
    { key: 'createdAt', label: 'Date', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadWallet();
  }

  loadWallet(): void {
    this.isLoading = true;
    this.error = null;

    this.walletService.getBalance().subscribe(
      (balance) => {
        this.balance = balance;
      },
      (error) => {
        this.error = error?.message || 'Failed to load wallet balance';
      }
    );

    this.walletService.getTransactions().subscribe(
      (response) => {
        this.transactions = response.data || response;
        this.isLoading = false;
      },
      (error) => {
        this.error = error?.message || 'Failed to load transactions';
        this.isLoading = false;
      }
    );
  }

  formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }

  formatDate(date: string): string {
    return formatDate(date);
  }
}
        <p>No transactions found</p>
      </div>
    </div>
  `,
  styles: [
    `
      .wallet-container {
        padding: 20px;
      }

      .balance-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 8px;
        margin-bottom: 30px;
      }

      .balance-label {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 8px;
      }

      .balance-value {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .balance-updated {
        font-size: 12px;
        opacity: 0.7;
      }

      .transactions-section h3 {
        margin-bottom: 16px;
      }

      .transactions-table {
        width: 100%;
        border-collapse: collapse;
      }

      .transactions-table th,
      .transactions-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      .transactions-table th {
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
      .empty-state {
        padding: 40px 20px;
        text-align: center;
        color: #999;
      }
    `,
  ],
})
export class WalletComponent implements OnInit {
  balance: WalletBalance | null = null;
  transactions: Transaction[] = [];
  loading = false;
  error: string | null = null;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadWallet();
  }

  loadWallet(): void {
    this.loading = true;
    this.error = null;

    this.walletService.getBalance().subscribe({
      next: (balance) => {
        this.balance = balance;
        this.loadTransactions();
      },
      error: (err) => {
        this.error = 'Failed to load wallet';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadTransactions(): void {
    this.walletService.getTransactions().subscribe({
      next: (response) => {
        this.transactions = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
        this.loading = false;
      },
    });
  }
}
