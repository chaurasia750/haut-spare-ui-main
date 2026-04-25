import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@haut-spare/shared-ui';

/**
 * 404 Not Found component
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './404.component.html',
  styleUrls: ['./404.component.scss'],
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}
