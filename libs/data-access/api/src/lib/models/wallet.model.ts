import { Transaction, WalletBalance } from './api.model';

/**
 * Extended wallet model with additional fields
 */
export interface ExtendedWallet extends WalletBalance {
  memberId: string;
  accountNumber?: string;
  accountType: 'checking' | 'savings' | 'investment';
  status: 'active' | 'suspended' | 'closed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Extended transaction model with additional fields
 */
export interface ExtendedTransaction extends Transaction {
  merchantName?: string;
  category?: string;
  tags?: string[];
  notes?: string;
  receiptUrl?: string;
  relatedTransactionId?: string;
}

/**
 * Transaction filter
 */
export interface TransactionFilter {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  type?: 'credit' | 'debit';
  status?: 'pending' | 'completed' | 'failed';
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Transaction summary
 */
export interface TransactionSummary {
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  averageTransaction: number;
  transactionsByType: { credit: number; debit: number };
  transactionsByStatus: { pending: number; completed: number; failed: number };
}

/**
 * Wallet statistics
 */
export interface WalletStats {
  currentBalance: number;
  previousBalance: number;
  balanceChange: number;
  percentageChange: number;
  transactionCount: number;
  lastTransactionDate?: string;
  summary: TransactionSummary;
}

/**
 * Transfer request
 */
export interface TransferRequest {
  toWalletId: string;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
}

/**
 * Transfer response
 */
export interface TransferResponse {
  fromWalletId: string;
  toWalletId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

/**
 * Wallet statement period
 */
export interface WalletStatement {
  statementId: string;
  memberId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  openingBalance: number;
  closingBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactions: ExtendedTransaction[];
  generatedAt: string;
}
