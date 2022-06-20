import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { HeroListComponent } from './hero-list.component';

@NgModule({
  providers: [],
  declarations: [HeroListComponent],
  imports: [SharedModule],
  exports: [HeroListComponent, SharedModule],
})
export class HeroListModule {}
