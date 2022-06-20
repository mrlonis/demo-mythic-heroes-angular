import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NavigationComponentComponent } from './navigation-component';

@NgModule({
  providers: [],
  declarations: [NavigationComponentComponent],
  imports: [
    // angular
    CommonModule,
    LayoutModule,
    RouterModule,

    // material
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  exports: [
    // angular
    CommonModule,
    LayoutModule,
    RouterModule,

    // material
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,

    // Core
    NavigationComponentComponent,
  ],
})
export class CoreModule {}
