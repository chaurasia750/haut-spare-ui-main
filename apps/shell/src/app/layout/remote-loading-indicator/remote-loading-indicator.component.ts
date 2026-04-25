import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RemoteLoadingService } from '../core/services/remote-loading.service';

/**
 * Loading indicator component displayed in Shell while remote is loading
 */
@Component({
  selector: 'app-remote-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading$ | async" class="loading-indicator">
      <div class="loading-container">
        <div class="spinner"></div>
        <div class="loading-text">
          <p class="message">Loading {{ currentRemote$ | async }}...</p>
          <div class="progress-bar">
            <div class="progress"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        pointer-events: none;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
      }

      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e2e8f0;
        border-top-color: #3182ce;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .loading-text {
        text-align: center;
      }

      .message {
        font-size: 16px;
        font-weight: 500;
        color: #2d3748;
        margin: 0 0 12px 0;
        text-transform: capitalize;
      }

      .progress-bar {
        width: 200px;
        height: 4px;
        background: #e2e8f0;
        border-radius: 2px;
        overflow: hidden;
      }

      .progress {
        height: 100%;
        background: linear-gradient(
          90deg,
          #3182ce,
          #63b3ed,
          #3182ce
        );
        background-size: 200% 100%;
        animation: progress 1.5s ease-in-out infinite;
      }

      @keyframes progress {
        0% {
          background-position: 200% 0;
        }
        50% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      @media (max-width: 480px) {
        .loading-container {
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
        }

        .message {
          font-size: 14px;
        }

        .progress-bar {
          width: 150px;
        }
      }
    `,
  ],
})
export class RemoteLoadingIndicatorComponent {
  isLoading$: Observable<boolean>;
  currentRemote$: Observable<string | undefined>;

  constructor(private remoteLoadingService: RemoteLoadingService) {
    this.isLoading$ = this.remoteLoadingService.isLoading();
    this.currentRemote$ = new Observable((subscriber) => {
      subscriber.next(this.remoteLoadingService.getCurrentRemote());
      this.remoteLoadingService.loadingState$.subscribe((state) => {
        subscriber.next(state.remoteName);
      });
    });
  }
}
