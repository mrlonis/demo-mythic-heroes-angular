import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeroDetailGuard } from './hero-detail.guard';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroListComponent } from './hero-list/hero-list.component';

@NgModule({
  declarations: [HeroListComponent, HeroDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'heroes', component: HeroListComponent },
      {
        path: 'heroes/:id',
        canActivate: [HeroDetailGuard],
        component: HeroDetailComponent,
      },
    ]),
  ],
})
export class HeroModule {}
