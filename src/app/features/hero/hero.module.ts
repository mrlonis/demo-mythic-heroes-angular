import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HeroDetailGuard } from './hero-detail.guard';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroListComponent } from './hero-list/hero-list.component';

@NgModule({
  declarations: [HeroListComponent, HeroDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'heroes', component: HeroListComponent },
      {
        path: 'heroes/:id',
        canActivate: [HeroDetailGuard],
        component: HeroDetailComponent,
      },
    ]),
  ],
  exports: [HeroListComponent, HeroDetailComponent],
})
export class HeroModule {}
