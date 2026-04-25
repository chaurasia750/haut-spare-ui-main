import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent, SidebarComponent, FooterComponent } from '@haut-spare/shared-layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
})
export class SharedLayoutModule {}
