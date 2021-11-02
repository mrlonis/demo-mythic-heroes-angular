import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AngularSplitModule } from 'angular-split';
import {
  AlternativeListComponent,
  AlwaysFilteredListComponent,
  BundlePaginatorComponent,
  FilterableListComponent,
  ListMenuDirective,
  ListMenuProviderDirective,
  // LoadingIndicatorComponent,
  RelativeDatePickerComponent,
  RichColumnDirective,
  RichRowDirective,
  SimpleListComponent,
  SplitTabGroupDirective,
  SplittableTabsComponent,
} from './components';

@NgModule({
  declarations: [
    BundlePaginatorComponent,
    FilterableListComponent,
    SimpleListComponent,
    RichColumnDirective,
    RichRowDirective,
    ListMenuDirective,
    ListMenuProviderDirective,
    AlternativeListComponent,
    AlwaysFilteredListComponent,
    // LoadingIndicatorComponent,
    RelativeDatePickerComponent,
    SplitTabGroupDirective,
    SplittableTabsComponent,
  ],
  imports: [
    // angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // material
    MatButtonToggleModule,
    MatMenuModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatTooltipModule,
    AngularSplitModule,
  ],
  exports: [
    // angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // material
    MatButtonToggleModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatTooltipModule,

    AngularSplitModule,

    // custom
    BundlePaginatorComponent,
    FilterableListComponent,
    SimpleListComponent,
    RichColumnDirective,
    RichRowDirective,
    ListMenuDirective,
    ListMenuProviderDirective,
    AlternativeListComponent,
    AlwaysFilteredListComponent,
    // LoadingIndicatorComponent,
    RelativeDatePickerComponent,
    SplitTabGroupDirective,
    SplittableTabsComponent,
  ],
})
export class SharedModule {}
