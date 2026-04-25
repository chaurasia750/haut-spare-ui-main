import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>{{ appName }}</h1>
        </div>
        <div class="user-menu">
          <span *ngIf="userName">Welcome, {{ userName }}</span>
          <button (click)="onLogout()" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        background-color: #333;
        color: white;
        padding: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .header-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .logout-btn {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .logout-btn:hover {
        background-color: #c82333;
      }
    `,
  ],
})
export class HeaderComponent {
  @Input() appName = 'Haut Spare';
  @Input() userName: string | null = null;
  @Output() logout = new EventEmitter<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
