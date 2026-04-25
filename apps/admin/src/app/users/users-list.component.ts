import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '@haut-spare/data-access-api';
import { ButtonComponent, TableComponent, TableColumn, LoadingSpinnerComponent } from '@haut-spare/shared-ui';
import { formatDate } from '@haut-spare/util-helpers';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TableComponent, LoadingSpinnerComponent],
  template: `
    <div class="users-container">
      <div class="users-header">
        <h1>Users Management</h1>
        <app-button (click)="onAddUser()" variant="primary">
          + Add User
        </app-button>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <app-loading-spinner message="Loading users..."></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading && error" class="error-message">
        <p>{{ error }}</p>
        <app-button (click)="loadUsers()" variant="secondary">Retry</app-button>
      </div>

      <app-table
        *ngIf="!isLoading && !error"
        [columns]="columns"
        [data]="users"
        [pagination]="true"
        [pageSize]="10"
        (rowEdit)="onEditUser($event)"
        (rowDelete)="onDeleteUser($event.id)"
      ></app-table>

      <div *ngIf="!isLoading && users.length === 0" class="empty-state">
        <p>No users found</p>
      </div>
    </div>
  `,
  styles: [
    `
      .users-container {
        padding: 24px;
      }

      .users-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .users-header h1 {
        font-size: 28px;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
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
        margin-bottom: 24px;
      }

      .error-message p {
        margin: 0 0 12px 0;
      }

      .empty-state {
        text-align: center;
        padding: 40px;
        color: #718096;
        background-color: #f7fafc;
        border-radius: 8px;
      }
    `,
  ],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.data || response;
        this.isLoading = false;
      },
      (error) => {
        this.error = error?.message || 'Failed to load users';
        this.isLoading = false;
      }
    );
  }

  onAddUser(): void {
    console.log('Add user clicked');
    // TODO: Open add user modal
  }

  onEditUser(user: User): void {
    console.log('Edit user:', user);
    // TODO: Open edit user modal
  }

  onDeleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.loadUsers();
        },
        (error) => {
          this.error = error?.message || 'Failed to delete user';
        }
      );
    }
  }
}
