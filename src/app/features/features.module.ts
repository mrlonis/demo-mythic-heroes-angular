import { NgModule } from '@angular/core';
import { HeroModule } from './hero';
import { WelcomeModule } from './welcome';

@NgModule({
  imports: [HeroModule, WelcomeModule],
  exports: [HeroModule, WelcomeModule],
})
export class FeatureModule {}
