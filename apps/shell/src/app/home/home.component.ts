import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-container">
      <h1>Welcome to Haut Spare</h1>
      <p>A powerful micro frontend architecture with independent deployable modules.</p>

      <div class="feature-cards">
        <div class="card">
          <h2>🏢 Admin Dashboard</h2>
          <p>Manage users, view reports, and control the system.</p>
          <a href="/admin">Go to Admin</a>
        </div>

        <div class="card">
          <h2>👤 Member Portal</h2>
          <p>Manage your profile, wallet, and transaction history.</p>
          <a href="/member">Go to Member</a>
        </div>

        <div class="card">
          <h2>🔧 Modern Architecture</h2>
          <p>Built with NX, Angular, Module Federation, and more.</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .home-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 40px 20px;
        text-align: center;
      }

      h1 {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 16px;
      }

      p {
        font-size: 16px;
        color: #666;
        margin-bottom: 40px;
      }

      .feature-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }

      .card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
      }

      .card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .card h2 {
        font-size: 20px;
        margin: 16px 0;
      }

      .card p {
        font-size: 14px;
        color: #666;
        margin: 12px 0;
      }

      .card a {
        display: inline-block;
        margin-top: 12px;
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s;
      }

      .card a:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class HomeComponent {}
