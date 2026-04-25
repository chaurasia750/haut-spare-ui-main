import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonComponent } from './lib/components/button/button.component';
import { CardComponent } from './lib/components/card/card.component';
import { LoadingSpinnerComponent } from './lib/components/loading-spinner/loading-spinner.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ButtonComponent, CardComponent, LoadingSpinnerComponent],
  exports: [ButtonComponent, CardComponent, LoadingSpinnerComponent],
})
export class SharedUiModule {}
