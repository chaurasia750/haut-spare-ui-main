import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { WalletBalance, Transaction, PaginatedResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private http: HttpService) {}

  /**
   * Get wallet balance
   */
  getBalance(): Observable<WalletBalance> {
    return this.http.get<WalletBalance>('/wallet/balance');
  }

  /**
   * Get transaction history with optional filters
   */
  getTransactions(filters?: any): Observable<PaginatedResponse<Transaction>> {
    return this.http.get<PaginatedResponse<Transaction>>('/wallet/transactions', { params: filters });
  }

  /**
   * Get transaction details by ID
   */
  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`/wallet/transactions/${id}`);
  }

  /**
   * Perform transfer
   */
  transfer(toWalletId: string, amount: number, description: string): Observable<Transaction> {
    return this.http.post<Transaction>('/wallet/transfer', {
      toWalletId,
      amount,
      description,
    });
  }
}
