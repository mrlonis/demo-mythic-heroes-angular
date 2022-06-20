import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { HeroDetailComponent } from './hero-detail.component';

@NgModule({
  providers: [],
  declarations: [HeroDetailComponent],
  imports: [SharedModule],
  exports: [HeroDetailComponent, SharedModule],
})
export class HeroDetailModule {}
