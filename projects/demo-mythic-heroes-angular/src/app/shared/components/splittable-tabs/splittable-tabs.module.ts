import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { AngularSplitModule } from 'angular-split';
import { SharedModule } from '../../shared.module';
import { SplitTabGroupDirective, SplittableTabsComponent } from './splittable-tabs.component';

@NgModule({
  declarations: [SplitTabGroupDirective, SplittableTabsComponent],
  imports: [
    // angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatIconModule,
    MatTabsModule,
    //vendor
    AngularSplitModule,
    //local
    SharedModule,
  ],
  exports: [SplitTabGroupDirective, SplittableTabsComponent],
})
export class SplittableTabsModule {}
