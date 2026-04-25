import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberRoutingModule } from './member-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MemberRoutingModule,
    ProfileComponent,
    WalletComponent,
    HistoryComponent,
  ],
  exports: [MemberRoutingModule],
})
export class MemberModule {}
