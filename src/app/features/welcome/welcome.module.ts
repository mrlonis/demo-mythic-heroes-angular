import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  providers: [],
  declarations: [WelcomeComponent],
  imports: [MatCardModule],
  exports: [MatCardModule, WelcomeComponent],
})
export class WelcomeModule {}
