import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div *ngIf="title" class="card-header">
        <h2>{{ title }}</h2>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 16px;
      }

      .card-header {
        padding: 16px;
        border-bottom: 1px solid #ddd;
      }

      .card-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .card-body {
        padding: 16px;
      }
    `,
  ],
})
export class CardComponent {
  @Input() title: string | null = null;
}
