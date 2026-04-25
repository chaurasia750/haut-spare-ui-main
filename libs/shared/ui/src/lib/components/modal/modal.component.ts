import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="onBackdropClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" (click)="onClose()" aria-label="Close modal">
            ×
          </button>
        </div>

        <div class="modal-body">
          <ng-content></ng-content>
        </div>

        <div class="modal-footer" *ngIf="showActions">
          <button
            class="btn btn-secondary"
            (click)="onCancel()"
            [disabled]="isLoading"
          >
            {{ cancelButtonText }}
          </button>
          <button
            class="btn btn-primary"
            (click)="onConfirm()"
            [disabled]="isLoading || isConfirmDisabled"
          >
            <span *ngIf="!isLoading">{{ confirmButtonText }}</span>
            <span *ngIf="isLoading">Loading...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
      }

      .modal-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #1a202c;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 28px;
        color: #718096;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f7fafc;
        }
      }

      .modal-body {
        padding: 20px;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 20px;
        border-top: 1px solid #e2e8f0;
        background-color: #f7fafc;
      }

      .btn {
        padding: 10px 20px;
        border-radius: 4px;
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      .btn-primary {
        background-color: #3182ce;
        color: white;

        &:hover:not(:disabled) {
          background-color: #2c5aa0;
        }
      }

      .btn-secondary {
        background-color: #e2e8f0;
        color: #2d3748;

        &:hover:not(:disabled) {
          background-color: #cbd5e0;
        }
      }
    `,
  ],
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() confirmButtonText: string = 'Confirm';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() showActions: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() isConfirmDisabled: boolean = false;
  @Input() closeOnBackdropClick: boolean = true;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm(): void {
    if (!this.isLoading && !this.isConfirmDisabled) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    if (!this.isLoading) {
      this.cancel.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.close.emit();
    }
  }
}
