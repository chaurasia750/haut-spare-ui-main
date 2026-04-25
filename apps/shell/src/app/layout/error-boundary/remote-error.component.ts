import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@haut-spare/shared-ui';

@Component({
  selector: 'app-remote-error',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="error-boundary">
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">{{ title }}</h2>
        <p class="error-message">{{ message }}</p>

        <div *ngIf="details" class="error-details">
          <p class="details-label">Error Details:</p>
          <pre class="details-content">{{ details }}</pre>
        </div>

        <div class="error-actions">
          <app-button variant="secondary" (click)="onGoBack()">
            ← Go Back
          </app-button>
          <app-button variant="primary" (click)="onRetry()">
            🔄 Retry Loading
          </app-button>
        </div>

        <div class="error-info">
          <p class="info-text">
            If this problem persists, please contact support or try clearing your browser cache.
          </p>
          <div class="support-links">
            <a href="/support" class="link">Support Center</a>
            <span class="separator">•</span>
            <a href="/faq" class="link">FAQ</a>
            <span class="separator">•</span>
            <a href="mailto:support@example.com" class="link">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .error-boundary {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 20px;
      }

      .error-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.15);
        padding: 40px;
        max-width: 500px;
        text-align: center;
      }

      .error-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }

      .error-title {
        font-size: 24px;
        font-weight: 700;
        color: #1a202c;
        margin: 0 0 12px 0;
      }

      .error-message {
        font-size: 16px;
        color: #4a5568;
        margin: 0 0 24px 0;
        line-height: 1.6;
      }

      .error-details {
        background-color: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        margin: 20px 0;
        text-align: left;
      }

      .details-label {
        font-size: 12px;
        font-weight: 600;
        color: #4a5568;
        text-transform: uppercase;
        margin: 0 0 8px 0;
      }

      .details-content {
        background: white;
        border: 1px solid #cbd5e0;
        border-radius: 4px;
        padding: 12px;
        font-size: 12px;
        color: #2d3748;
        overflow-x: auto;
        margin: 0;
        max-height: 150px;
        overflow-y: auto;
      }

      .error-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin: 24px 0;
        flex-wrap: wrap;
      }

      .error-info {
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e2e8f0;
      }

      .info-text {
        font-size: 14px;
        color: #718096;
        margin: 0 0 12px 0;
      }

      .support-links {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .link {
        color: #3182ce;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }

      .separator {
        color: #cbd5e0;
      }

      @media (max-width: 600px) {
        .error-container {
          padding: 24px;
        }

        .error-icon {
          font-size: 48px;
        }

        .error-title {
          font-size: 20px;
        }

        .error-message {
          font-size: 14px;
        }

        .error-actions {
          flex-direction: column;
        }

        .error-actions app-button {
          width: 100%;
        }
      }
    `,
  ],
})
export class RemoteErrorComponent {
  @Input() title: string = 'Failed to Load Module';
  @Input() message: string = 'The requested module failed to load. Please try again.';
  @Input() details?: string;
  @Input() remoteName?: string;

  @Output() retry = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }

  onGoBack(): void {
    window.history.back();
    this.goBack.emit();
  }
}
