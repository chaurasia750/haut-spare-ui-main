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
  templateUrl: './remote-loading-indicator.component.html',
  styleUrls: ['./remote-loading-indicator.component.scss'],
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
