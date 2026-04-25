import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="member-container">
      <h1>Member Portal</h1>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  title = 'member';
}
