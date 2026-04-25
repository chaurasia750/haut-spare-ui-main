import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from '@haut-spare/shared-auth';
import { ErrorInterceptor, LoggingInterceptor, CachingInterceptor } from '@haut-spare/data-access-api';
import {
  ButtonComponent,
  CardComponent,
  LoadingSpinnerComponent,
  InputComponent,
  ModalComponent,
  TableComponent,
  SelectComponent,
} from '@haut-spare/shared-ui';

import { AppComponent } from './app.component';
import { MemberRoutingModule } from './member-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MemberRoutingModule,
    ProfileComponent,
    WalletComponent,
    HistoryComponent,
    ButtonComponent,
    CardComponent,
    LoadingSpinnerComponent,
    InputComponent,
    ModalComponent,
    TableComponent,
    SelectComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
