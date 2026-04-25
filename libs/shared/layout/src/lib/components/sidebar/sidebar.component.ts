import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface NavLink {
  label: string;
  path: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <nav class="nav">
        <button class="toggle-btn" (click)="onToggle()">
          {{ isCollapsed ? '≡' : '✕' }}
        </button>
        <ul *ngIf="!isCollapsed" class="nav-list">
          <li *ngFor="let link of navLinks">
            <a [href]="link.path" (click)="onNavigate(link)">
              <span *ngIf="link.icon" class="icon">{{ link.icon }}</span>
              <span class="label">{{ link.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        background-color: #f8f9fa;
        border-right: 1px solid #dee2e6;
        width: 240px;
        transition: all 0.3s ease;
        height: calc(100vh - 60px);
        position: sticky;
        top: 60px;
      }

      .sidebar.collapsed {
        width: 60px;
      }

      .nav {
        padding: 16px 0;
      }

      .toggle-btn {
        width: 100%;
        padding: 12px 16px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        text-align: center;
        color: #333;
      }

      .toggle-btn:hover {
        background-color: #e9ecef;
      }

      .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-list li {
        margin: 0;
        padding: 0;
      }

      .nav-list a {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        color: #333;
        text-decoration: none;
        transition: all 0.2s;
        gap: 8px;
      }

      .nav-list a:hover {
        background-color: #e9ecef;
        color: #007bff;
      }

      .icon {
        width: 20px;
        text-align: center;
      }

      .label {
        flex: 1;
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() navLinks: NavLink[] = [];
  @Input() isCollapsed = false;
  @Output() navigate = new EventEmitter<NavLink>();
  @Output() toggle = new EventEmitter<void>();

  onNavigate(link: NavLink): void {
    this.navigate.emit(link);
  }

  onToggle(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit();
  }
}
