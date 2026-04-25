import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@haut-spare/shared-ui';

@Component({
  selector: 'app-remote-error',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './remote-error.component.html',
  styleUrls: ['./remote-error.component.scss'],
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
