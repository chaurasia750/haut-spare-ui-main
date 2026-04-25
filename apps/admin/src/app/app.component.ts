import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="admin-container">
      <h1>Admin Dashboard</h1>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  title = 'admin';
}
