import { NgModule } from '@angular/core';
import { HeroDetailModule } from './hero-detail';
import { HeroListModule } from './hero-list';

@NgModule({
  declarations: [],
  imports: [HeroDetailModule, HeroListModule],
  exports: [HeroDetailModule, HeroListModule],
})
export class HeroModule {}
