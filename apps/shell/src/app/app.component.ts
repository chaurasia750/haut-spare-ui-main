import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '@haut-spare/shared-auth';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Haut Spare UI - Shell</h1>
        <nav>
          <a routerLink="/home" routerLinkActive="active">Home</a>
          <a routerLink="/admin" routerLinkActive="active">Admin</a>
          <a routerLink="/member" routerLinkActive="active">Member</a>
        </nav>
      </header>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer">
        <p>&copy; 2024 Haut Spare. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .app-header {
        background-color: #333;
        color: white;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .app-header h1 {
        margin: 0 0 1rem 0;
      }

      .app-header nav a {
        color: white;
        text-decoration: none;
        margin-right: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s;
      }

      .app-header nav a:hover,
      .app-header nav a.active {
        background-color: #555;
      }

      .app-content {
        flex: 1;
        padding: 2rem;
      }

      .app-footer {
        background-color: #f0f0f0;
        border-top: 1px solid #ddd;
        padding: 1rem;
        text-align: center;
        margin-top: auto;
      }
    `,
  ],
})
export class AppComponent {
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}
}
 
