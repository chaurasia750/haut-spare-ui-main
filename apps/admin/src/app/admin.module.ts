import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListComponent } from './users/users-list.component';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    DashboardComponent,
    UsersListComponent,
    ReportsComponent,
  ],
  exports: [AdminRoutingModule],
})
export class AdminModule {}
