import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} {{ appName }}. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
        <p class="version">v{{ version }}</p>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background-color: #f8f9fa;
        border-top: 1px solid #dee2e6;
        padding: 16px 20px;
        margin-top: 40px;
      }

      .footer-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
      }

      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }

      .footer-links {
        display: flex;
        gap: 16px;
      }

      .footer-links a {
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
      }

      .footer-links a:hover {
        text-decoration: underline;
      }

      .version {
        text-align: right;
        color: #999;
        font-size: 12px;
      }

      @media (max-width: 768px) {
        .footer-content {
          flex-direction: column;
          text-align: center;
        }

        .footer-links {
          justify-content: center;
        }
      }
    `,
  ],
})
export class FooterComponent {
  @Input() appName = 'Haut Spare';
  @Input() version = '1.0.0';

  currentYear = new Date().getFullYear();
}
